 'use client'

import { useRouter, useSearchParams } from 'next/navigation'  // Importation des hooks pour la gestion de la navigation et des paramètres de recherche dans Next.js.
import React from 'react'

import { formUrlQuery } from '@/lib/utils'  // Utilisation d'une fonction utilitaire pour manipuler les paramètres de l'URL.

import { Button } from '../ui/button'  // Importation du composant 'Button' pour créer des boutons.
import { ChevronLeft, ChevronRight } from 'lucide-react'  // Importation des icônes pour la navigation (gauche et droite).
import { useTranslations } from 'next-intl'  // Utilisation de l'internationalisation avec Next.js pour gérer les traductions.

type PaginationProps = {
  page: number | string  // La page actuelle à afficher.
  totalPages: number  // Le nombre total de pages.
  urlParamName?: string  // Le nom du paramètre de l'URL utilisé pour la page (optionnel, par défaut 'page').
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()  // Hook de Next.js pour naviguer.
  const searchParams = useSearchParams()  // Hook de Next.js pour récupérer les paramètres de recherche dans l'URL.

  // Fonction qui gère le changement de page lors du clic sur les boutons de pagination (précédent ou suivant).
  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1  // Calcule la nouvelle page à afficher.

    // Génère l'URL avec le nouveau paramètre de page.
    const newUrl = formUrlQuery({
      params: searchParams.toString(),  // Récupère les paramètres de recherche actuels dans l'URL.
      key: urlParamName || 'page',  // Utilise le nom du paramètre de la page, ou 'page' par défaut.
      value: pageValue.toString(),  // Définit la nouvelle page comme valeur du paramètre.
    })

    // Effectue une navigation vers l'URL avec la nouvelle page.
    router.push(newUrl, { scroll: true })  // Redirige l'utilisateur vers la nouvelle URL.
  }

  const t = useTranslations()  // Hook pour récupérer les traductions en fonction de la langue de l'utilisateur.

  return (
    <div className='flex items-center gap-2'>
      {/* Bouton "Précédent" */}
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('prev')}  // Appel de la fonction pour changer de page (précédente).
        disabled={Number(page) <= 1}  // Désactive le bouton si la page actuelle est la première.
        className='w-24'
      >
        <ChevronLeft /> {t('Search.Previous')}  {/* Affiche l'icône de flèche vers la gauche et la traduction du texte "Précédent". */}
      </Button>
      
      {/* Affichage de la page actuelle et du nombre total de pages */}
      {t('Search.Page')} {page} {t('Search.of')} {totalPages}  {/* Traduction et affichage de la page actuelle et du nombre total de pages. */}
      
      {/* Bouton "Suivant" */}
      <Button
        size='lg'
        variant='outline'
        onClick={() => onClick('next')}  // Appel de la fonction pour changer de page (suivante).
        disabled={Number(page) >= totalPages}  // Désactive le bouton si la page actuelle est la dernière.
        className='w-24'
      >
        {t('Search.Next')} <ChevronRight />  {/* Affiche la traduction du texte "Suivant" et l'icône de flèche vers la droite. */}
      </Button>
    </div>
  )
}

export default Pagination
