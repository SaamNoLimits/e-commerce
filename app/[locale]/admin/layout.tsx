 // Importation des composants nécessaires
import Image from 'next/image' // Pour afficher les images optimisées avec Next.js
import Link from 'next/link' // Pour générer des liens dans l'application Next.js
import React from 'react' // Import de React pour les composants
import Menu from '@/components/shared/header/menu' // Importation du composant Menu spécifique à l'admin
import { AdminNav } from './admin-nav' // Importation de la barre de navigation pour l'admin
import { getSetting } from '@/lib/actions/setting.actions' // Fonction pour récupérer les paramètres du site

// Définition du composant AdminLayout
export default async function AdminLayout({
  children, // Reçoit les enfants du composant (ce qui sera affiché dans la section principale)
}: {
  children: React.ReactNode // Type de la prop 'children', représentant le contenu dynamique du layout
}) {
  // Appel à la fonction getSetting pour récupérer les informations du site (par exemple, le nom du site)
  const { site } = await getSetting()

  return (
    // Structure principale du layout avec une couleur de fond dégradée et une transition d'animation
    <div className='flex flex-col min-h-screen bg-gradient-to-r from-[#62a4d3] via-[#4599d5] to-[#cde8fc] transition-all duration-500'>
      
      {/* En-tête avec une ombre portée pour un effet visuel */}
      <div className='shadow-md'>
        {/* Barre de navigation principale */}
        <div className='flex h-16 items-center px-4'>
          
          {/* Logo du site avec un lien vers la page d'accueil */}
          <Link href='/'>
            <Image
              src='/icons/logo.png' // Source de l'image du logo
              width={48} // Largeur de l'image
              height={48} // Hauteur de l'image
              alt={`${site.name} logo`} // Texte alternatif pour l'image
            />
          </Link>

          {/* Barre de navigation de l'admin qui est cachée sur mobile */}
          <AdminNav className='mx-6 hidden md:flex text-black text-xl' />

          {/* Menu pour l'administrateur avec des options supplémentaires */}
          <div className='ml-auto flex items-center space-x-4'>
            <Menu forAdmin /> {/* Affichage du menu pour l'administrateur */}
          </div>
        </div>

        {/* Barre de navigation pour l'admin, visible uniquement sur mobile (affichage plus simple) */}
        <div>
          <AdminNav className='flex md:hidden px-4 pb-2 text-black text-xl' />
        </div>
      </div>

      {/* Section principale qui contiendra les enfants du layout */}
      <div className='flex-1 p-4'>
        {children} {/* Contenu dynamique passé au composant (les pages ou autres composants) */}
      </div>
    </div>
  )
}
