 // 'use client' indique que ce composant est destiné à être exécuté côté client dans un environnement Next.js 13+.
'use client'

import { useState } from 'react'  // Importation du hook 'useState' pour gérer l'état local.
import Image from 'next/image'    // Importation du composant 'Image' de Next.js pour l'optimisation des images.
import Zoom from 'react-medium-image-zoom'  // Importation de la bibliothèque 'react-medium-image-zoom' pour la fonctionnalité de zoom sur l'image.
import 'react-medium-image-zoom/dist/styles.css'  // Importation des styles nécessaires à la fonctionnalité de zoom.

export default function ProductGallery({ images }: { images: string[] }) {
  // Utilisation du hook 'useState' pour suivre l'image sélectionnée, initialisée à 0 (première image).
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className='flex gap-2'> {/* Conteneur principal avec un espacement entre les éléments. */}
      
      {/* Section des miniatures d'images */}
      <div className='flex flex-col gap-2 mt-8'>
        {images.map((image, index) => (
          // Pour chaque image dans le tableau 'images', un bouton est créé pour changer l'image sélectionnée.
          <button
            key={index}  // La clé unique de chaque bouton est l'index de l'image dans le tableau.
            onClick={() => {  // Lors du clic sur une miniature, on met à jour l'image sélectionnée.
              setSelectedImage(index)
            }}
            onMouseOver={() => {  // Lorsqu'on survole la miniature, on change également l'image sélectionnée.
              setSelectedImage(index)
            }}
            className={`bg-white rounded-lg overflow-hidden ${
              // Si l'image est sélectionnée, un contour bleu est ajouté, sinon un contour gris clair est utilisé.
              selectedImage === index
                ? 'ring-2 ring-blue-500'
                : 'ring-1 ring-gray-300'
            }`}
          >
            {/* Affichage de la miniature de l'image avec une taille de 48x48 pixels. */}
            <Image src={image} alt={'product image'} width={48} height={48} />
          </button>
        ))}
      </div>

      {/* Section pour afficher l'image principale avec un zoom possible */}
      <div className='w-full'>
        <Zoom>  {/* Le composant Zoom permet de zoomer sur l'image lors du clic. */}
          <div className='relative h-[500px]'> {/* Conteneur avec une hauteur fixe de 500px pour l'image principale. */}
            <Image
              src={images[selectedImage]}  // L'image sélectionnée est affichée.
              alt={'product image'}
              fill  // L'image occupe toute la largeur et hauteur de son conteneur.
              sizes='90vw'  // La taille de l'image sera 90% de la largeur de la vue.
              className='object-contain'  // L'image sera redimensionnée pour maintenir son ratio tout en étant contenue dans son conteneur.
              priority  // Donne la priorité à cette image pour qu'elle soit chargée rapidement.
            />
          </div>
        </Zoom>
      </div>
    </div>
  )
}
