 // On importe la fonction notFound depuis Next.js.
// Elle permet d’afficher la page 404 automatiquement si une donnée n’existe pas.
import { notFound } from 'next/navigation'

// Import de la bibliothèque React (obligatoire dans tous les composants React)
import React from 'react'

// Import de la fonction auth, qui permet de récupérer la session de l’utilisateur connecté
import { auth } from '@/auth'

// Import de la fonction qui permet de récupérer un ordre (commande) par son identifiant
import { getOrderById } from '@/lib/actions/order.actions'

// Import du composant de formulaire qui affiche les détails d’une commande
import OrderDetailsForm from '@/components/shared/order/order-details-form'

// Import du composant Link de Next.js pour créer des liens internes sans rechargement de page
import Link from 'next/link'

// On définit les métadonnées de la page, ici le titre qui apparaîtra dans l’onglet du navigateur
export const metadata = {
  title: 'Admin Order Details',
}

// Définition du composant principal de la page des détails d'une commande côté admin
// Il reçoit en paramètre un objet `params` qui contient l'`id` de la commande
const AdminOrderDetailsPage = async (props: {
  params: Promise<{
    id: string // l'identifiant de la commande dans l'URL
  }>
}) => {
  // On attend (await) que les paramètres soient disponibles
  const params = await props.params

  // On extrait l'id de la commande depuis les paramètres
  const { id } = params

  // On récupère les données de la commande à partir de son identifiant via une fonction asynchrone
  const order = await getOrderById(id)

  // Si la commande n’existe pas dans la base de données, on affiche la page 404
  if (!order) notFound()

  // On récupère la session utilisateur pour savoir s’il est connecté et connaître son rôle
  const session = await auth()

  // Le composant retourne une section <main> qui contient l’affichage des détails de la commande
  return (
    <main className='max-w-6xl mx-auto p-4 bg-transparent'>
      {/* Barre de navigation secondaire (breadcrumbs) pour montrer le chemin de navigation actuel */}
      <div className='flex mb-4 !bg-transparent'>
        {/* Lien pour retourner à la liste des commandes dans l'interface admin */}
        <Link href='/admin/orders'>Orders</Link>
        {/* Petit chevron utilisé pour séparer les niveaux de navigation */}
        <span className='mx-1'>›</span>
        {/* Lien vers la page actuelle, ici identifiée par l'id de la commande */}
        <Link href={`/admin/orders/${order._id}`}>{order._id}</Link>
      </div>

      {/* Composant qui affiche les détails de la commande via un formulaire */}
      <OrderDetailsForm
        order={order} // on passe les données de la commande récupérées plus haut
        isAdmin={session?.user?.role === 'Admin' || false} // on vérifie si l’utilisateur est un administrateur
      />
    </main>
  )
}

// On exporte le composant de la page pour que Next.js le reconnaisse comme une route
export default AdminOrderDetailsPage
