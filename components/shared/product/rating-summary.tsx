// 'use client' indique que ce composant est destiné à être exécuté côté client dans un environnement Next.js 13+.
'use client'

import { Progress } from '@/components/ui/progress'  // Importation du composant Progress pour afficher des barres de progression.
import Rating from './rating'  // Importation du composant Rating pour afficher l'évaluation sous forme d'étoiles.
import { Separator } from '@/components/ui/separator'  // Importation du composant Separator pour ajouter une séparation visuelle.

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'  // Importation des composants Popover pour afficher des informations supplémentaires dans une fenêtre contextuelle.
import { Button } from '@/components/ui/button'  // Importation du composant Button pour afficher un bouton cliquable.
import { useTranslations } from 'next-intl'  // Importation de la fonction 'useTranslations' pour gérer la traduction dans l'application.
import { ChevronDownIcon } from 'lucide-react'  // Importation de l'icône ChevronDown de la bibliothèque 'lucide-react' pour indiquer une liste déroulante.

type RatingSummaryProps = {
  asPopover?: boolean  // Optionnel: Afficher le résumé des évaluations dans une fenêtre contextuelle (Popover).
  avgRating: number  // La note moyenne du produit.
  numReviews: number  // Le nombre total d'avis.
  ratingDistribution: {  // La distribution des évaluations sous forme de tableau avec le nombre de votes pour chaque note.
    rating: number
    count: number
  }[]
}

export default function RatingSummary({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) {
  const t = useTranslations()  // Utilisation du hook 'useTranslations' pour gérer les traductions dans le composant.

  // Fonction pour afficher la distribution des évaluations sous forme de pourcentage.
  const RatingDistribution = () => {
    // Calcul des pourcentages pour chaque note en fonction du nombre d'avis total.
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),  // Calcul du pourcentage d'avis pour chaque note.
    }))

    return (
      <>
        <div className='flex flex-wrap items-center gap-1 cursor-help'>
          <Rating rating={avgRating} />  {/* Affiche l'évaluation moyenne sous forme d'étoiles. */}
          <span className='text-lg font-semibold'>
            {t('Product.avgRating out of 5', {
              avgRating: avgRating.toFixed(1),  // Affichage de la note moyenne arrondie à une décimale.
            })}
          </span>
        </div>
        <div className='text-lg '>
          {t('Product.numReviews ratings', { numReviews })}  {/* Affiche le nombre total d'avis. */}
        </div>

        <div className='space-y-3'>
          {/* Affichage de la distribution des évaluations triées par note (du plus élevé au plus bas). */}
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)  // Trie la distribution par note, de la plus élevée à la plus basse.
            .map(({ rating, percentage }) => (
              <div
                key={rating}  // Clé unique pour chaque ligne de distribution.
                className='grid grid-cols-[50px_1fr_30px] gap-2 items-center'
              >
                <div className='text-sm'>
                  {' '}
                  {t('Product.rating star', { rating })}  {/* Affiche la note sous forme d'étoiles. */}
                </div>
                <Progress value={percentage} className='h-4' />  {/* Affiche une barre de progression représentant le pourcentage d'avis pour cette note. */}
                <div className='text-sm text-right'>{percentage}%</div>  {/* Affiche le pourcentage à droite. */}
              </div>
            ))}
        </div>
      </>
    )
  }

  return asPopover ? (
    // Si 'asPopover' est true, afficher les évaluations dans une fenêtre contextuelle (Popover).
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          {/* Bouton pour déclencher le Popover. Affiche la note moyenne et l'icône de flèche vers le bas. */}
          <Button variant='ghost' className='px-2 [&_svg]:size-6 text-base'>
            <span>{avgRating.toFixed(1)}</span>  {/* Affiche la note moyenne arrondie à une décimale. */}
            <Rating rating={avgRating} />  {/* Affiche les étoiles pour la note moyenne. */}
            <ChevronDownIcon className='w-5 h-5 text-muted-foreground' />  {/* Icône de flèche vers le bas. */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-4' align='end'>
          <div className='flex flex-col gap-2'>
            {/* Affiche la distribution des évaluations dans le Popover. */}
            <RatingDistribution />
            <Separator />  {/* Séparateur pour mieux structurer le contenu. */}
            {/* Lien vers la section des avis clients. */}
            <Link className='highlight-link text-center' href='#reviews'>
              {t('Product.See customer reviews')}
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      {/* Lien vers la section des avis clients sous le Popover. */}
      <div className=' '>
        <Link href='#reviews' className='highlight-link'>
          {t('Product.numReviews ratings', { numReviews })}  {/* Affiche le nombre total d'avis. */}
        </Link>
      </div>
    </div>
  ) : (
    // Si 'asPopover' est false, afficher la distribution des évaluations directement dans la page.
    <RatingDistribution />
  )
}
