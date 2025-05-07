 'use server' // Indique que ce code s'exécute côté serveur (Next.js server actions)

import { Cart, IOrderList, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { connectToDatabase } from '../db'
import { auth } from '@/auth'
import { OrderInputSchema } from '../validator'
import Order, { IOrder } from '../db/models/order.model'
import { revalidatePath } from 'next/cache'
import { sendAskReviewOrderItems, sendPurchaseReceipt } from '@/emails'
import { paypal } from '../paypal'
import { DateRange } from 'react-day-picker'
import Product from '../db/models/product.model'
import User from '../db/models/user.model'
import mongoose from 'mongoose'
import { getSetting } from './setting.actions'

// CREATE - Crée une nouvelle commande à partir du panier client
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase() // Connexion à la base de données
    const session = await auth() // Récupération de la session utilisateur
    if (!session) throw new Error('User not authenticated')
    
    // Recalcul des prix et dates de livraison côté serveur
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )
    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Crée une commande à partir du panier avec calcul des prix et dates
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  // Recalcule les dates de livraison et prix
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  // Valide et structure les données de la commande
  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })
  return await Order.create(order) // Crée la commande en base
}

// Met à jour une commande comme payée
export async function updateOrderToPaid(orderId: string) {
  try {
    await connectToDatabase()
    // Récupère la commande avec les infos utilisateur
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    
    if (!order) throw new Error('Order not found')
    if (order.isPaid) throw new Error('Order is already paid')
    
    // Met à jour le statut de paiement
    order.isPaid = true
    order.paidAt = new Date()
    await order.save()
    
    // Met à jour le stock des produits (sauf en environnement local)
    if (!process.env.MONGODB_URI?.startsWith('mongodb://localhost'))
      await updateProductStock(order._id)
      
    // Envoie un email de confirmation
    if (order.user.email) await sendPurchaseReceipt({ order })
    
    revalidatePath(`/account/orders/${orderId}`) // Revalide le cache Next.js
    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Met à jour le stock des produits après paiement (transaction MongoDB)
const updateProductStock = async (orderId: string) => {
  const session = await mongoose.connection.startSession()

  try {
    session.startTransaction()
    const opts = { session }

    // Met à jour le statut de la commande
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true, paidAt: new Date() },
      opts
    )
    if (!order) throw new Error('Order not found')

    // Pour chaque produit de la commande, décrémente le stock
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session)
      if (!product) throw new Error('Product not found')

      product.countInStock -= item.quantity
      await Product.updateOne(
        { _id: product._id },
        { countInStock: product.countInStock },
        opts
      )
    }
    await session.commitTransaction()
    session.endSession()
    return true
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

// Marque une commande comme livrée
export async function deliverOrder(orderId: string) {
  try {
    await connectToDatabase()
    // Récupère la commande avec infos utilisateur
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    
    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')
    
    // Met à jour le statut de livraison
    order.isDelivered = true
    order.deliveredAt = new Date()
    await order.save()
    
    // Envoie un email pour demander un avis
    if (order.user.email) await sendAskReviewOrderItems({ order })
    
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// DELETE - Supprime une commande
export async function deleteOrder(id: string) {
  try {
    await connectToDatabase()
    const res = await Order.findByIdAndDelete(id)
    if (!res) throw new Error('Order not found')
    revalidatePath('/admin/orders') // Revalide le cache
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL ORDERS - Récupère toutes les commandes (pour admin)
export async function getAllOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  // Récupère la configuration de pagination
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  
  // Récupère les commandes avec pagination
  const orders = await Order.find()
    .populate('user', 'name') // Jointure avec l'utilisateur
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
    
  const ordersCount = await Order.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
  }
}

// Récupère les commandes de l'utilisateur connecté
export async function getMyOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  
  const skipAmount = (Number(page) - 1) * limit
  // Récupère uniquement les commandes de l'utilisateur
  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
    
  const ordersCount = await Order.countDocuments({ user: session?.user?.id })

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}

// Récupère une commande par son ID
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

// Crée une commande PayPal
export async function createPayPalOrder(orderId: string) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId)
    if (order) {
      // Crée la commande PayPal avec le montant total
      const paypalOrder = await paypal.createOrder(order.totalPrice)
      
      // Sauvegarde l'ID de la commande PayPal
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: '',
        status: '',
        pricePaid: '0',
      }
      await order.save()
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Valide un paiement PayPal
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) throw new Error('Order not found')

    // Capture le paiement PayPal
    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')
      
    // Met à jour le statut de la commande
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }
    await order.save()
    await sendPurchaseReceipt({ order }) // Envoie le reçu
    revalidatePath(`/account/orders/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Calcule les dates de livraison et les prix (frais de port, taxes...)
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  // Récupère les dates de livraison disponibles depuis les paramètres
  const { availableDeliveryDates } = await getSetting()
  
  // Calcule le prix total des articles
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  // Détermine la date de livraison
  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]
        
  // Calcule les frais de port
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice

  // Calcule les taxes (15%)
  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)
  
  // Calcule le prix total
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

// Récupère des statistiques sur les commandes
export async function getOrderSummary(date: DateRange) {
  await connectToDatabase()

  // Compte les commandes dans la période
  const ordersCount = await Order.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  
  // Compte les produits créés dans la période
  const productsCount = await Product.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  
  // Compte les utilisateurs créés dans la période
  const usersCount = await User.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })

  // Calcule le chiffre d'affaires total
  const totalSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
    { $project: { totalSales: { $ifNull: ['$sales', 0] } } },
  ])
  const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalSales : 0

  // Prépare les données pour le graphique des ventes mensuelles (6 derniers mois)
  const today = new Date()
  const sixMonthEarlierDate = new Date(
    today.getFullYear(),
    today.getMonth() - 5,
    1
  )
  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sixMonthEarlierDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: '$totalSales',
      },
    },

    { $sort: { label: -1 } },
  ])
  
  // Récupère les catégories et produits les plus vendus
  const topSalesCategories = await getTopSalesCategories(date)
  const topSalesProducts = await getTopSalesProducts(date)

  // Récupère les dernières commandes
  const {
    common: { pageSize },
  } = await getSetting()
  const limit = pageSize
  const latestOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .limit(limit)
    
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    monthlySales: JSON.parse(JSON.stringify(monthlySales)),
    salesChartData: JSON.parse(JSON.stringify(await getSalesChartData(date))),
    topSalesCategories: JSON.parse(JSON.stringify(topSalesCategories)),
    topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
    latestOrders: JSON.parse(JSON.stringify(latestOrders)) as IOrderList[],
  }
}

// Récupère les données pour le graphique des ventes quotidiennes
async function getSalesChartData(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '/',
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.day' },
          ],
        },
        totalSales: 1,
      },
    },
    { $sort: { date: 1 } }, // Trie par date croissante
  ])

  return result
}

// Récupère les produits les plus vendus
async function getTopSalesProducts(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Décompose le tableau des articles commandés
    { $unwind: '$items' },

    // Groupe par produit pour calculer le CA par produit
    {
      $group: {
        _id: {
          name: '$items.name',
          image: '$items.image',
          _id: '$items.product',
        },
        totalSales: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        },
      },
    },
    {
      $sort: {
        totalSales: -1, // Trie par CA décroissant
      },
    },
    { $limit: 6 }, // Limite aux 6 premiers

    // Formate le résultat
    {
      $project: {
        _id: 0,
        id: '$_id._id',
        label: '$_id.name',
        image: '$_id.image',
        value: '$totalSales',
      },
    },

    { $sort: { _id: 1 } },
  ])

  return result
}

// Récupère les catégories les plus vendues
async function getTopSalesCategories(date: DateRange, limit = 5) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Décompose le tableau des articles commandés
    { $unwind: '$items' },
    // Groupe par catégorie
    {
      $group: {
        _id: '$items.category',
        totalSales: { $sum: '$items.quantity' }, // Somme des quantités vendues
      },
    },
    // Trie par quantité décroissante
    { $sort: { totalSales: -1 } },
    // Limite aux N premières catégories
    { $limit: limit },
  ])

  return result
}