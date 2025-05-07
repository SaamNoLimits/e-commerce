import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'

// Définition du titre de la page
const PAGE_TITLE = 'Change Your Name'

// Métadonnées pour le SEO et le titre de l'onglet du navigateur
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// Fonction principale qui génère la page
export default async function ProfilePage() {
  // Récupération de la session de l'utilisateur (utilisateur actuellement connecté)
  const session = await auth()

  // Récupération des paramètres du site, y compris son nom
  const { site } = await getSetting()

  return (
    <div className='mb-24'>
      {/* Fournit la session à tous les composants enfants */}
      <SessionProvider session={session}>
      
        {/* Barre de navigation pour guider l'utilisateur */}
        <div className='flex gap-2 text-2xl'>
          <Link href='/account'>Your Account</Link> {/* Lien vers la page du compte */}
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link> {/* Lien vers la gestion du compte */}
          <span>›</span>
          <span>{PAGE_TITLE}</span> {/* Titre actuel de la page */}
        </div>

        {/* Titre principal de la page */}
        <h1 className='text-3xl font-bold py-4'>{PAGE_TITLE}</h1>

        {/* Carte contenant le formulaire de modification du nom */}
        <Card className='max-w-2xl'>
          <CardContent className='p-4 flex justify-between flex-wrap'>
          
            {/* Message d'information à l'utilisateur */}
            <p className='text-lg py-2'>
              If you want to change the name associated with your {site.name}
              &apos;s account, you may do so below. Be sure to click the Save
              Changes button when you are done.
            </p>

            {/* Insertion du formulaire de changement de nom */}
            <ProfileForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
