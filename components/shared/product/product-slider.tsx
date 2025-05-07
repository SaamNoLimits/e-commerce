// 'use client' est une directive qui permet de signaler que ce composant est destiné à être exécuté côté client, ce qui est utilisé dans les environnements Next.js 13+ avec le rendu côté client.
'use client'

import * as React from 'react'
// Importation des composants nécessaires pour le carrousel depuis un composant personnalisé
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

// Importation du composant ProductCard pour afficher un produit spécifique dans chaque élément du carrousel
import ProductCard from './product-card'

// Importation du modèle `IProduct`, qui représente la structure d'un produit dans la base de données
import { IProduct } from '@/lib/db/models/product.model'

// Définition du composant `ProductSlider` qui affiche une liste de produits dans un carrousel
export default function ProductSlider({
  title,       // Titre facultatif pour le carrousel
  products,    // Liste des produits à afficher dans le carrousel
  hideDetails = false, // Booléen optionnel pour masquer les détails du produit (par défaut à false)
}: {
  title?: string // Le titre est optionnel
  products: IProduct[] // La liste des produits est obligatoire
  hideDetails?: boolean // Option pour masquer les détails, false par défaut
}) {
  return (
    // Le div principal qui contient le carrousel avec un fond d'arrière-plan
    <div className='w-full bg-background'>
      {/* Affichage du titre si disponible */}
      <h2 className='h2-bold mb-5'>{title}</h2>
      
      {/* Composant Carousel qui permet d'afficher les éléments sous forme de carrousel (défilement horizontal) */}
      <Carousel
        opts={{
          align: 'start', // Alignement des éléments du carrousel au début
        }}
        className='w-full' // Prend toute la largeur disponible
      >
        {/* Contenu du carrousel */}
        <CarouselContent>
          {/* On boucle sur chaque produit pour afficher un élément dans le carrousel */}
          {products.map((product) => (
            // Chaque élément du carrousel représente un produit
            <CarouselItem
              key={product.slug} // Utilisation de `slug` comme clé unique pour chaque élément
              className={ // On ajuste la largeur de chaque élément du carrousel en fonction de `hideDetails`
                hideDetails
                  ? 'md:basis-1/4 lg:basis-1/6' // Si `hideDetails` est vrai, les éléments auront une taille réduite
                  : 'md:basis-1/3 lg:basis-1/5' // Sinon, ils occupent une taille plus grande
              }
            >
              {/* Affichage du produit avec le composant ProductCard */}
              <ProductCard
                hideDetails={hideDetails}  // On passe la valeur de `hideDetails` pour ajuster l'affichage du produit
                hideAddToCart  // Masque le bouton "Ajouter au panier"
                hideBorder     // Masque la bordure autour du produit
                product={product} // Le produit spécifique à afficher
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Bouton pour naviguer vers l'élément précédent du carrousel */}
        <CarouselPrevious className='left-0' />
        
        {/* Bouton pour naviguer vers l'élément suivant du carrousel */}
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  )
}
