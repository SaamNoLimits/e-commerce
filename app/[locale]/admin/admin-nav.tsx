 // Déclaration du mode 'client' pour activer le rendu côté client
'use client'

// Importation des composants nécessaires
import Link from 'next/link' // Pour générer des liens dans l'application Next.js
import { usePathname } from 'next/navigation' // Pour obtenir le chemin actuel de la page
import React from 'react' // Import de React, nécessaire pour tout composant React

import { cn } from '@/lib/utils' // Fonction utilitaire pour gérer les classes CSS conditionnelles
import { useTranslations } from 'next-intl' // Utilisé pour la gestion des traductions

// Définition des liens à afficher dans la barre de navigation
const links = [
  {
    title: 'Products', // Titre de la section
    href: '/admin/products', // Lien de la section
  },
  {
    title: 'Orders', // Titre de la section
    href: '/admin/orders', // Lien de la section
  },
  {
    title: 'Users', // Titre de la section
    href: '/admin/users', // Lien de la section
  },
]

// Définition du composant AdminNav
export function AdminNav({
  className, // Propriété pour personnaliser les classes CSS
  ...props // Autres propriétés HTML héritées
}: React.HTMLAttributes<HTMLElement>) {
  
  // Récupère le chemin actuel de la page (utile pour styliser les liens actifs)
  const pathname = usePathname()

  // Récupère les traductions pour l'admin depuis le fichier de traductions
  const t = useTranslations('Admin')

  return (
    // Rendu de la barre de navigation, en utilisant 'cn' pour gérer les classes dynamiques
    <nav
      className={cn(
        'flex items-center flex-wrap overflow-hidden gap-2 md:gap-4', // Flexbox pour la mise en page
        className // Permet d'ajouter des classes CSS supplémentaires via la prop 'className'
      )}
      {...props} // Applique toutes les autres propriétés passées au composant
    >
      {/* Parcourt chaque élément du tableau 'links' et génère un lien */}
      {links.map((item) => (
        <Link
          key={item.href} // Clé unique pour chaque élément de la liste
          href={item.href} // Lien vers la page associée
          className={cn(
            'text-black text-2xl font-bold hover:text-black transition-colors duration-200', // Style de base du lien (couleur, taille de texte, gras, hover)
            // Vérifie si le chemin actuel contient l'URL du lien, et applique un style spécifique si c'est le cas
            pathname.includes(item.href) 
              ? 'text-black font-bold' // Si le lien est actif (utilisé ici pour indiquer que la page correspondante est sélectionnée)
              : 'text-black font-bold' // Par défaut, le style reste le même
          )}
        >
          {t(item.title)} {/* Traduction du titre de l'élément (par exemple 'Products', 'Orders', etc.) */}
        </Link>
      ))}
    </nav>
  )
}
