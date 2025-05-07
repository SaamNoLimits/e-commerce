import { Metadata } from 'next'
import Link from 'next/link'
import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'

 // ========================
// 1. Constante pour le titre de la page
// ========================

// On définit une constante qui contient le titre de la page.
// Cela permet de réutiliser ce même titre à plusieurs endroits
// (dans les métadonnées et dans le contenu visible).
const PAGE_TITLE = 'Your Orders'

// ========================
// 2. Métadonnées SEO de la page
// ========================

// On exporte un objet `metadata` qui contient les informations
// de référencement (SEO) comme le titre de l’onglet du navigateur.
// Ce sera utilisé automatiquement par Next.js.
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// ========================
// 3. Composant principal de la page des commandes
// ========================

// On exporte le composant React principal de la page.
// Il est `async` car on utilise `await` à l’intérieur pour les appels de données.
export default async function OrdersPage(props: {
  // On attend un objet contenant les paramètres d’URL.
  // Ici on s’attend à un paramètre `page` (comme ?page=2 dans l’URL).
  searchParams: Promise<{ page: string }>
}) {
  // On attend que `searchParams` soit résolu (car c’est une Promise).
  const searchParams = await props.searchParams

  // On convertit `searchParams.page` en nombre avec Number().
  // S’il n’existe pas ou que ce n’est pas un nombre valide, on utilise 1 comme valeur par défaut.
  const page = Number(searchParams.page) || 1

  // ========================
  // 4. Récupération des commandes
  // ========================

  // On appelle une fonction qui récupère les commandes de l’utilisateur connecté
  // pour la page en question (pagination).
  const orders = await getMyOrders({
    page, // ici on passe la page actuelle
  })

  // ========================
  // 5. Retour de l’interface de la page
  // ========================
  return (
    <div className="p-4">
    
      {/* ===== Fil d’Ariane (breadcrumb) ===== */}
      {/* Il aide l'utilisateur à savoir où il se trouve dans le site */}
      <div className='flex gap-2 text-base'>
        <Link href='/account' className="hover:underline">Your Account</Link>
        <span>›</span>
        <span className="font-medium">{PAGE_TITLE}</span>
      </div>

      {/* ===== Titre principal de la page ===== */}
      <h1 className='text-2xl font-bold pt-4 text-[#6d4c3d]'>{PAGE_TITLE}</h1>

      {/* ===== Tableau des commandes ===== */}
      <div className='overflow-x-auto mt-6'>
        {/* On utilise le composant Table avec un fond dégradé et des coins arrondis */}
        <Table className='bg-gradient-to-br from-[#fffefc] to-[#dfd8d1] rounded-xl shadow-md'>
          <TableHeader>
            <TableRow className='bg-[#D8BFAA] text-white'>
              {/* Les en-têtes de colonnes (Order ID, Date, Total, etc.) */}
              <TableHead className='text-base p-3 font-bold'>Order ID</TableHead>
              <TableHead className='text-base p-3 font-bold'>Date</TableHead>
              <TableHead className='text-base p-3 font-bold'>Total</TableHead>
              <TableHead className='text-base p-3 font-bold'>Paid</TableHead>
              <TableHead className='text-base p-3 font-bold'>Delivered</TableHead>
              <TableHead className='text-base p-3 font-bold'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Si l'utilisateur n'a aucune commande */}
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='text-center p-4 text-base'>
                  You have no orders.
                </TableCell>
              </TableRow>
            )}

            {/* Sinon, on affiche chaque commande dans une ligne du tableau */}
            {orders.data.map((order: IOrder) => (
              <TableRow key={order._id} className='hover:bg-[#F0E2D0]'>
                <TableCell className='p-3 text-base'>
                  {/* Lien vers la page des détails de cette commande */}
                  <Link href={`/account/orders/${order._id}`} className="hover:underline">
                    {/* On affiche un ID formaté, plus court ou plus lisible */}
                    {formatId(order._id)}
                  </Link>
                </TableCell>

                <TableCell className='p-3 text-base'>
                  {/* Affiche la date de création de la commande formatée */}
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>

                <TableCell className='p-3 text-base'>
                  {/* Affiche le prix total de la commande via un composant spécialisé */}
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>

                <TableCell className='p-3 text-base'>
                  {/* Si la commande est payée et la date de paiement existe, on l'affiche */}
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'} {/* Sinon on affiche "No" */}
                </TableCell>

                <TableCell className='p-3 text-base'>
                  {/* Pareil pour la livraison : on affiche la date si livré, sinon "No" */}
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>

                <TableCell className='p-3'>
                  {/* Bouton "Details" qui redirige vers la page de détails de la commande */}
                  <Link href={`/account/orders/${order._id}`}>
                    <span className='px-2 py-1 bg-[#D8BFAA] text-white rounded-md hover:bg-[#C19A6B] transition-colors text-base'>
                      Details
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Si on a plusieurs pages de commandes, on affiche la pagination */}
        {orders.totalPages > 1 && (
          <div className="mt-6">
            {/* Le composant Pagination s'occupe d'afficher les boutons de page */}
            <Pagination page={page} totalPages={orders.totalPages} />
          </div>
        )}
      </div>

      {/* Liste de l'historique des produits récemment consultés */}
      <BrowsingHistoryList className='mt-12' />
    </div>
  )
}
