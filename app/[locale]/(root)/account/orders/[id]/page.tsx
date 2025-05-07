import { notFound } from 'next/navigation'  // Importation pour rediriger l'utilisateur vers une page 404 si la ressource n'est pas trouvée
import React from 'react'

import { auth } from '@/auth'  // Importation de la fonction pour vérifier l'authentification de l'utilisateur
import { getOrderById } from '@/lib/actions/order.actions'  // Importation de la fonction pour récupérer un ordre par ID
import OrderDetailsForm from '@/components/shared/order/order-details-form'  // Importation du formulaire de détails de commande
import Link from 'next/link'  // Importation de la balise de lien pour la navigation
import { formatId } from '@/lib/utils'  // Importation de la fonction pour formater l'ID de la commande

// Fonction pour générer les métadonnées de la page (comme le titre de l'onglet du navigateur)
export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params  // Extraction des paramètres de l'URL

  return {
    title: `Order ${formatId(params.id)}`,  // Définition du titre de la page basé sur l'ID de la commande
  }
}

// Page principale pour afficher les détails de la commande
export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params  // Extraction des paramètres de l'URL

  const { id } = params  // Récupération de l'ID de la commande depuis les paramètres

  // Récupération des détails de la commande par son ID
  const order = await getOrderById(id)
  if (!order) notFound()  // Si la commande n'existe pas, on redirige vers la page 404

  // Vérification de la session de l'utilisateur
  const session = await auth()

  return (
    <>
      {/* Barre de navigation (breadcrumb) pour indiquer à l'utilisateur où il se trouve */}
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>  {/* Lien vers le compte de l'utilisateur */}
        <span>›</span>
        <Link href='/account/orders'>Your Orders</Link>  {/* Lien vers la liste des commandes de l'utilisateur */}
        <span>›</span>
        <span>Order {formatId(order._id)}</span>  {/* Affichage de l'ID formaté de la commande */}
      </div>

      {/* Titre de la page */}
      <h1 className='h1-bold py-4'>Order {formatId(order._id)}</h1>  {/* Titre qui affiche l'ID formaté de la commande */}

      {/* Formulaire de détails de commande */}
      <OrderDetailsForm
        order={order}  // On passe les détails de la commande au formulaire
        isAdmin={session?.user?.role === 'Admin' || false}  // On vérifie si l'utilisateur est un administrateur
      />
    </>
  )
}
