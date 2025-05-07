// Importation des métadonnées pour définir les informations de la page
import { Metadata } from 'next'

// Importation du composant Link pour la navigation
import Link from 'next/link'

// Authentification de l'utilisateur via NextAuth ou une méthode personnalisée
import { auth } from '@/auth'

// Composant personnalisé pour la suppression avec boîte de dialogue
import DeleteDialog from '@/components/shared/delete-dialog'

// Bouton stylisé avec les composants UI
import { Button } from '@/components/ui/button'

// Importation des composants de tableau pour l'affichage des données
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Importation des actions de gestion des commandes (suppression, récupération)
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'

// Fonctions utilitaires pour formater les dates et les identifiants
import { formatDateTime, formatId } from '@/lib/utils'

// Interface TypeScript pour définir le type des commandes
import { IOrderList } from '@/types'

// Composant d'affichage de prix du produit
import ProductPrice from '@/components/shared/product/product-price'

// Composant de pagination
import Pagination from '@/components/shared/pagination'

// Définition du titre de la page avec les métadonnées
export const metadata: Metadata = {
  title: 'Admin Orders',
}

// Composant principal de la page des commandes (accessibles uniquement par les admins)
export default async function OrdersPage({ searchParams }: { searchParams: { page?: string } }) {
  // Récupération du numéro de page depuis les paramètres de recherche (URL)
  const page = Number(searchParams?.page) || 1

  // Vérification de la session de l'utilisateur
  const session = await auth()

  // Si l'utilisateur n'est pas admin, on génère une erreur
  if (session?.user.role !== 'Admin') throw new Error('Admin permission required')

  // Récupération de toutes les commandes paginées pour l'administrateur
  const orders = await getAllOrders({ page })

  return (
    <div className='w-full p-6'>
      {/* Titre principal de la page */}
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Orders</h1>

      {/* Tableau principal contenant les données des commandes */}
      <Table className="w-full">
        {/* En-tête du tableau avec style dégradé */}
        <TableHeader className="bg-gradient-to-r from-[#afcce2] via-[#b2d2ed] to-[#8fb7ea] rounded-t-xl">
          <TableRow>
            <TableHead className='text-black text-xl py-5 font-semibold'>Id</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Date</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Buyer</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Total</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Paid</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Delivered</TableHead>
            <TableHead className='text-black text-xl py-5 font-semibold'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* Corps du tableau - chaque ligne représente une commande */}
        <TableBody>
          {/* Boucle sur toutes les commandes récupérées */}
          {orders.data.map((order: IOrderList) => (
            <TableRow key={order._id} className='hover:bg-gray-50 bg-white'>
              {/* Colonne : ID formaté */}
              <TableCell className='font-mono text-base text-black py-6 bg-white'>
                {formatId(order._id)}
              </TableCell>

              {/* Colonne : Date de création de la commande */}
              <TableCell className='text-black py-6 bg-white text-base'>
                {formatDateTime(order.createdAt!).dateTime}
              </TableCell>

              {/* Colonne : Nom de l'utilisateur (acheteur) */}
              <TableCell className='text-black py-6 bg-white text-base'>
                {/* Vérification si l'utilisateur existe encore */}
                {order.user ? order.user.name : <span className='italic text-gray-500'>Deleted User</span>}
              </TableCell>

              {/* Colonne : Prix total de la commande */}
              <TableCell className='text-black py-6 bg-white text-base'>
                <ProductPrice price={order.totalPrice} plain />
              </TableCell>

              {/* Colonne : Statut de paiement */}
              <TableCell className={`py-6 text-base ${order.isPaid ? 'text-black' : 'text-red-600'} bg-white`}>
                {/* Si payé, afficher la date du paiement */}
                {order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'No'}
              </TableCell>

              {/* Colonne : Statut de livraison */}
              <TableCell className={`py-6 text-base ${order.isDelivered ? 'text-black' : 'text-red-600'} bg-white`}>
                {/* Si livré, afficher la date de livraison */}
                {order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'No'}
              </TableCell>

              {/* Colonne : Boutons d'action (détails + suppression) */}
              <TableCell className='flex gap-3 py-6 bg-white'>
                {/* Bouton pour voir les détails de la commande */}
                <Button 
                  asChild 
                  variant='outline' 
                  size='sm' 
                  className='border-brown-500 text-brown-600 hover:bg-brown-100 text-base'
                >
                  <Link href={`/admin/orders/${order._id}`}>Details</Link>
                </Button>

                {/* Bouton pour supprimer la commande avec confirmation */}
                <DeleteDialog id={order._id} action={deleteOrder} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Affichage de la pagination si plus d'une page */}
      {orders.totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <Pagination page={page} totalPages={orders.totalPages} />
        </div>
      )}
    </div>
  )
}
