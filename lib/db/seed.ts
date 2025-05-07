/* eslint-disable @typescript-eslint/no-explicit-any */

// Importation des données factices
import data from '@/lib/data'

// Connexion à la base de données MongoDB
import { connectToDatabase } from '.'

// Modèles mongoose
import User from './models/user.model'
import Product from './models/product.model'
import Review from './models/review.model'
import Order from './models/order.model'
import WebPage from './models/web-page.model'
import Setting from './models/setting.model'

// Utilitaires pour générer des données
import {
  calculateFutureDate,
  calculatePastDate,
  generateId,
  round2,
} from '../utils'

// Pour charger les variables d’environnement (fichier .env)
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

// Types TypeScript utilisés dans la génération des commandes
import { OrderItem, IOrderInput, ShippingAddress } from '@/types'

// Chargement des variables d’environnement à partir du répertoire courant
loadEnvConfig(cwd())

// Fonction principale asynchrone pour semer les données dans la base
const main = async () => {
  try {
    // Déstructuration des données à insérer
    const { users, products, reviews, webPages, settings } = data

    // Connexion à MongoDB
    await connectToDatabase(process.env.MONGODB_URI)

    // Suppression des anciennes données (pour avoir une base propre)
    await User.deleteMany()
    const createdUser = await User.insertMany(users)

    await Setting.deleteMany()
    const createdSetting = await Setting.insertMany(settings)

    await WebPage.deleteMany()
    await WebPage.insertMany(webPages)

    await Product.deleteMany()
    const createdProducts = await Product.insertMany(
      products.map((x) => ({ ...x, _id: undefined })) // Retirer _id pour éviter les doublons
    )

    await Review.deleteMany()
    const rws = []

    // Création de faux avis basés sur la distribution des notes des produits
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUser[x % createdUser.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }

    // Insertion des avis générés
    const createdReviews = await Review.insertMany(rws)

    await Order.deleteMany()
    const orders = []

    // Génération de 200 commandes factices
    for (let i = 0; i < 200; i++) {
      orders.push(
        await generateOrder(
          i,
          createdUser.map((x) => x._id),
          createdProducts.map((x) => x._id)
        )
      )
    }

    // Insertion des commandes dans la base
    const createdOrders = await Order.insertMany(orders)

    // Affichage du résumé
    console.log({
      createdUser,
      createdProducts,
      createdReviews,
      createdOrders,
      createdSetting,
      message: 'Seeded database successfully',
    })

    // Fermeture du processus
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

// Fonction qui génère une commande fictive avec 3 produits
const generateOrder = async (
  i: number,
  users: any,
  products: any
): Promise<IOrderInput> => {
  // Sélection de 3 produits pour la commande
  const product1 = await Product.findById(products[i % products.length])
  const product2 = await Product.findById(
    products[
      i % products.length >= products.length - 1
        ? (i % products.length) - 1
        : (i % products.length) + 1
    ]
  )
  const product3 = await Product.findById(
    products[
      i % products.length >= products.length - 2
        ? (i % products.length) - 2
        : (i % products.length) + 2
    ]
  )

  // Vérification que les produits existent bien
  if (!product1 || !product2 || !product3) throw new Error('Product not found')

  // Création des éléments de la commande
  const items = [
    {
      clientId: generateId(),
      product: product1._id,
      name: product1.name,
      slug: product1.slug,
      quantity: 1,
      image: product1.images[0],
      category: product1.category,
      price: product1.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product2._id,
      name: product2.name,
      slug: product2.slug,
      quantity: 2,
      image: product2.images[0],
      category: product1.category,
      price: product2.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product3._id,
      name: product3.name,
      slug: product3.slug,
      quantity: 3,
      image: product3.images[0],
      category: product1.category,
      price: product3.price,
      countInStock: product1.countInStock,
    },
  ]

  // Assemblage de la commande finale avec adresse, prix, etc.
  const order = {
    user: users[i % users.length],
    items: items.map((item) => ({
      ...item,
      product: item.product,
    })),
    shippingAddress: data.users[i % users.length].address,
    paymentMethod: data.users[i % users.length].paymentMethod,
    isPaid: true,
    isDelivered: true,
    paidAt: calculatePastDate(i),
    deliveredAt: calculatePastDate(i),
    createdAt: calculatePastDate(i),
    expectedDeliveryDate: calculateFutureDate(i % 2),
    ...calcDeliveryDateAndPriceForSeed({
      items: items,
      shippingAddress: data.users[i % users.length].address,
      deliveryDateIndex: i % 2,
    }),
  }

  return order
}

// Fonction pour calculer les dates de livraison et les prix
export const calcDeliveryDateAndPriceForSeed = ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const { availableDeliveryDates } = data.settings[0]

  // Calcul du prix des articles
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  // Choix de la date de livraison selon l'index
  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice = deliveryDate.shippingPrice

  // Calcul de la taxe (15%)
  const taxPrice = round2(itemsPrice * 0.15)

  // Calcul du prix total
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )

  // Retourne tous les détails nécessaires pour compléter la commande
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

// Appel de la fonction principale
main()
