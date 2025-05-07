import React from 'react'
import { Star } from 'lucide-react'  // Importation de l'icône 'Star' de la bibliothèque 'lucide-react' pour afficher les étoiles.

export default function Rating({
  rating = 0,  // La note à afficher, avec une valeur par défaut de 0.
  size = 6,  // Taille des étoiles, avec une valeur par défaut de 6.
}: {
  rating: number  // Propriétés du composant : 'rating' représente la note à afficher.
  size?: number  // 'size' est optionnel, la taille de l'étoile (par défaut 6).
}) {
  // Calcul des étoiles pleines, partielles et vides.
  const fullStars = Math.floor(rating)  // Nombre d'étoiles pleines (entier).
  const partialStar = rating % 1  // Fraction de l'étoile partielle (s'il y en a).
  const emptyStars = 5 - Math.ceil(rating)  // Nombre d'étoiles vides.

  return (
    <div
      className='flex items-center'  // Utilisation d'une classe pour aligner les éléments en ligne (les étoiles).
      aria-label={`Rating: ${rating} out of 5 stars`}  // Accessibilité : étiquette ARIA pour la note.
    >
      {/* Affichage des étoiles pleines (par exemple, si la note est 4, il y a 4 étoiles pleines). */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}  // Clé unique pour chaque étoile pleine.
          className={`w-${size} h-${size} fill-primary text-primary`}  // Classe dynamique pour la taille et la couleur de l'étoile pleine.
        />
      ))}

      {/* Affichage de l'étoile partielle, si applicable. Par exemple, si la note est 4.5, une étoile partielle sera affichée. */}
      {partialStar > 0 && (
        <div className='relative'>  {/* Le conteneur de l'étoile partielle a une position relative pour gérer l'overlay. */}
          <Star className={`w-${size} h-${size} text-primary`} />  {/* L'étoile de base de la partie partielle. */}
          <div
            className='absolute top-0 left-0 overflow-hidden'  // Style pour masquer l'excédent de l'étoile partielle.
            style={{ width: `${partialStar * 100}%` }}  // La largeur de l'étoile partielle est contrôlée par la fraction de la note.
          >
            <Star className='w-6 h-6 fill-primary text-primary' />  {/* Affiche une étoile partielle qui est masquée en fonction de la largeur. */}
          </div>
        </div>
      )}

      {/* Affichage des étoiles vides (pour compléter un total de 5 étoiles). */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}  // Clé unique pour chaque étoile vide.
          className={`w-${size} h-${size} text-primary`}  // Classe pour les étoiles vides, qui n'ont pas de remplissage.
        />
      ))}
    </div>
  )
}
