import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import CredentialsSignInForm from './credentials-signin-form'
import { getSetting } from '@/lib/actions/setting.actions'
 // 📌 Définir les métadonnées de la page : titre affiché dans l'onglet du navigateur
export const metadata: Metadata = {
  title: 'Sign In', // Le titre de la page de connexion
}

// Fonction principale de la page de connexion
export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string }> // Paramètre de recherche qui contient l'URL de redirection après la connexion réussie
}) {
  // On récupère les paramètres de la recherche
  const searchParams = await props.searchParams // Extraction des paramètres de recherche qui incluent l'URL de redirection
  const { site } = await getSetting() // Récupération des paramètres du site, par exemple, pour le nom du site ou d'autres configurations

  // Si aucun `callbackUrl` n'est passé, on redirige par défaut vers la page d'accueil "/"
  const { callbackUrl = '/' } = searchParams

  // 🔹 Vérifier si l'utilisateur est déjà authentifié (session active)
  const session = await auth() // Appel de la fonction `auth()` pour vérifier si une session existe (utilisateur connecté)
  if (session) {
    // Si une session est active, on redirige l'utilisateur vers l'URL de redirection (`callbackUrl`)
    return redirect(callbackUrl)
  }

  // Si l'utilisateur n'est pas connecté, on affiche le formulaire de connexion
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      {/* 📌 Conteneur pour le formulaire de connexion */}
      <div className="w-full max-w-4xl p-6 bg-transparent">
        {/* Appel du composant du formulaire de connexion */}
        <CredentialsSignInForm /> {/* Affichage du formulaire personnalisé pour la connexion */}
      </div>
    </div>
  )
}