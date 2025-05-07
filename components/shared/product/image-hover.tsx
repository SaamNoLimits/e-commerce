 /* eslint-disable @typescript-eslint/no-explicit-any */
'use client'  // Indique que ce code est exécuté côté client (dans le navigateur), utilisé dans Next.js.

import Image from 'next/image'  // Importation du composant Image de Next.js pour le rendu des images optimisées.
import { useState } from 'react'  // Importation du hook useState de React pour gérer l'état du composant.

const ImageHover = ({
  src,  // L'URL de l'image par défaut à afficher.
  hoverSrc,  // L'URL de l'image à afficher lorsque l'utilisateur survole l'image.
  alt,  // Le texte alternatif pour les images (accessibilité).
}: {
  src: string  // Type de la prop 'src' : chaîne de caractères représentant l'URL de l'image.
  hoverSrc: string  // Type de la prop 'hoverSrc' : chaîne de caractères représentant l'URL de l'image au survol.
  alt: string  // Type de la prop 'alt' : chaîne de caractères pour le texte alternatif.
}) => {
  const [isHovered, setIsHovered] = useState(false)  // Déclaration de l'état 'isHovered' pour savoir si l'image est survolée.
  let hoverTimeout: any  // Variable pour gérer le délai avant de changer l'état 'isHovered'.

  // Fonction pour gérer l'événement 'mouseenter' (lorsque la souris entre dans la zone de l'image).
  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => setIsHovered(true), 1000)  // Après 1 seconde (1000 ms), l'image de survol sera affichée.
  }

  // Fonction pour gérer l'événement 'mouseleave' (lorsque la souris quitte la zone de l'image).
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout)  // Si la souris quitte avant 1 seconde, annule le délai.
    setIsHovered(false)  // Remet l'image par défaut.
  }

  return (
    <div
      className='relative h-52'  // Définir un conteneur de hauteur fixe (52 unités) et une position relative pour les images.
      onMouseEnter={handleMouseEnter}  // Ajouter un gestionnaire d'événement pour 'mouseenter'.
      onMouseLeave={handleMouseLeave}  // Ajouter un gestionnaire d'événement pour 'mouseleave'.
    >
      {/* Image par défaut */}
      <Image
        src={src}  // L'URL de l'image par défaut.
        alt={alt}  // Le texte alternatif pour l'image.
        fill  // Le composant 'Image' de Next.js remplira l'espace de son parent.
        sizes='80vw'  // Spécifie que l'image occupe 80% de la largeur de la fenêtre.
        className={`object-contain transition-opacity duration-500 ${  // Ajout des classes Tailwind CSS pour la gestion de l'opacité et des animations.
          isHovered ? 'opacity-0' : 'opacity-100'  // Si l'image est survolée, l'opacité de l'image par défaut devient 0.
        }`}
      />
      
      {/* Image de survol */}
      <Image
        src={hoverSrc}  // L'URL de l'image à afficher lors du survol.
        alt={alt}  // Le texte alternatif pour l'image de survol.
        fill  // Le composant 'Image' de Next.js remplira l'espace de son parent.
        sizes='80vw'  // Spécifie que l'image occupe 80% de la largeur de la fenêtre.
        className={`absolute inset-0 object-contain transition-opacity duration-500 ${  // Ajout des classes Tailwind CSS pour la gestion de l'opacité et des animations.
          isHovered ? 'opacity-100' : 'opacity-0'  // Si l'image est survolée, l'opacité de l'image de survol devient 100%.
        }`}
      />
    </div>
  )
}

export default ImageHover  // Exportation du composant ImageHover pour l'utiliser ailleurs.
