// Importation des modules nécessaires de Next.js et NextAuth
import { Metadata } from 'next' // Permet de définir les métadonnées de la page
import { SessionProvider } from 'next-auth/react' // Gère la session utilisateur avec NextAuth
import { auth } from '@/auth' // Fonction personnalisée pour récupérer la session

// Importation des composants et utilitaires pour le design
import Link from 'next/link' // Permet la navigation interne sans rechargement de la page
import { Card, CardContent } from '@/components/ui/card' // Composants pour afficher le contenu sous forme de carte
import { Separator } from '@/components/ui/separator' // Élément séparateur pour organiser la mise en page
import { Button } from '@/components/ui/button' // Bouton stylisé pour les actions

// Définition du titre de la page
const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE, // Attribue le titre de la page
}

// Fonction principale de la page (composant React asynchrone)
export default async function ProfilePage() {
  // Récupération de la session utilisateur avec authentification
  const session = await auth()

  // Si aucune session n'est trouvée, affiche un message de chargement
  if (!session || !session.user) {
    return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
  }

  return (
    <div className="mb-24">
      {/* Fournisseur de session pour rendre les données utilisateur accessibles */}
      <SessionProvider session={session}>
        
        {/* Fil d'Ariane (breadcrumb) pour la navigation */}
        <div className="flex gap-2 text-[#a67c52] text-lg">
          <Link href="/account" className="hover:underline">Your Account</Link>
          <span>›</span>
          <span className="font-semibold">{PAGE_TITLE}</span>
        </div>

        {/* Titre principal de la page */}
        <h1 className="text-[34px] font-bold text-[#6d4c3d] py-6">{PAGE_TITLE}</h1>

        {/* Carte contenant les informations du profil utilisateur */}
        <Card className="max-w-2xl bg-gradient-to-r from-[#d4b29b] to-[#e6e2dc] shadow-lg rounded-lg">
          
          {/* Section: Nom de l'utilisateur */}
          <CardContent className="p-6 flex justify-between flex-wrap text-[#5a3e32]">
            <div>
              <h3 className="font-bold text-xl">Name</h3>
              <p className="text-lg">{session.user.name}</p> {/* Affichage du nom de l'utilisateur */}
            </div>
            <Link href="/account/manage/name">
              <Button className="rounded-full w-32 bg-[#976954] hover:bg-[#b5846d] text-white text-lg">
                Edit
              </Button>
            </Link>
          </CardContent>
          <Separator className="bg-[#b88c66]" /> {/* Séparateur visuel */}

          {/* Section: Email de l'utilisateur */}
          <CardContent className="p-6 flex justify-between flex-wrap text-[#5a3e32]">
            <div>
              <h3 className="font-bold text-xl">Email</h3>
              <p className="text-lg">{session.user.email}</p> {/* Affichage de l'email */}
              <p className="text-sm text-gray-500">Will be implemented in the next version</p> {/* Indication que cette fonctionnalité est en cours */}
            </div>
            {/* Bouton désactivé car l'édition de l'email n'est pas encore implémentée */}
            <Button
              disabled
              className="rounded-full w-32 bg-gray-400 text-white text-lg border-2 border-gray-500 cursor-not-allowed opacity-75"
            >
              Edit
            </Button>
          </CardContent>
          <Separator className="bg-[#b88c66]" />

          {/* Section: Mot de passe */}
          <CardContent className="p-6 flex justify-between flex-wrap text-[#5a3e32]">
            <div>
              <h3 className="font-bold text-xl">Password</h3>
              <p className="text-lg">************</p> {/* Masquage du mot de passe */}
              <p className="text-sm text-gray-500">Will be implemented in the next version</p> {/* Fonctionnalité en attente */}
            </div>
            {/* Bouton désactivé car l'édition du mot de passe n'est pas encore implémentée */}
            <Button
              disabled
              className="rounded-full w-32 bg-gray-400 text-white text-lg border-2 border-gray-500 cursor-not-allowed opacity-75"
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
