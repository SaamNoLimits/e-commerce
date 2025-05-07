import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'

// Définition des métadonnées de la page (ici, le titre)
export const metadata: Metadata = {
  title: 'Sign Up', // Le titre qui apparaîtra dans l'onglet du navigateur
}

// Fonction principale de la page SignUp
export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string // Paramètre de recherche contenant l'URL de redirection après l'inscription
  }>
}) {
  // On attend la résolution du paramètre searchParams pour extraire le callbackUrl
  const searchParams = await props.searchParams

  // Récupération du callbackUrl à partir des paramètres de recherche
  const { callbackUrl } = searchParams

  // Vérification de la session utilisateur via la fonction auth()
  const session = await auth()
  
  // Si l'utilisateur est déjà authentifié, on le redirige vers le callbackUrl ou la page d'accueil '/'
  if (session) {
    return redirect(callbackUrl || '/')
  }

  // Si l'utilisateur n'est pas connecté, on retourne la vue de la page d'inscription
  return (
    <div className='w-full flex justify-center items-center min-h-screen'>
      {/* Card : conteneur stylisé pour la page d'inscription */}
      <Card className='bg-transparent border-2 border-[#f3f1f1] rounded-lg shadow-2xl shadow-[#ffffff] p-6'>
        
        {/* En-tête de la carte */}
        <CardHeader className='flex justify-center items-center mb-6'>
          {/* Titre de la carte avec style spécial "glowing" */}
          <CardTitle className='text-5xl font-bold text-white relative glowing-title'>
            Create account {/* Texte du titre */}
            {/* Effet de lumière autour du titre */}
            <span className="glow-shadow"></span>
          </CardTitle>
        </CardHeader>
        
        {/* Contenu de la carte */}
        <CardContent className='bg-transparent'>
          {/* Formulaire d'inscription */}
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}