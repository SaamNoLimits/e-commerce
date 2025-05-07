'use client'

import React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const t = useTranslations('Home')

  return (
    <>
      {/* Application de la police "Lucida Bright" */}
      <style jsx global>{`
        /* Appliquer la police Lucida Bright aux titres avec dégradé marron plus foncé */
        .gradient-text {
          background: linear-gradient(90deg, #8b4513, #c17b48); /* Dégradé marron plus foncé */
          -webkit-background-clip: text; /* Applique le dégradé au texte */
          color: transparent; /* Rend le texte transparent pour voir le dégradé */
          font-family: 'Lucida Bright', serif; /* Police Lucida Bright */
          font-size: 3.5rem; /* Taille de police plus modérée */
          font-weight: 700; /* Poids du texte pour le rendre plus gras */
          line-height: 1.4; /* Espacement des lignes */
          word-break: break-word; /* Permet au texte de se casser sur plusieurs lignes */
          display: inline-block; /* Permet au texte de se répartir sur plusieurs lignes */
        }

        /* Bouton avec dégradé marron plus foncé */
        .gradient-button {
          background-image: linear-gradient(90deg, #8b4513, #c17b48); /* Dégradé marron plus foncé */
          color: white; /* Texte en blanc */
          border: none; /* Pas de bordure */
          padding: 8px 16px; /* Espacement du texte ajusté */
          font-size: 1.1rem; /* Taille du texte réduite */
          font-weight: bold; /* Poids du texte */
          border-radius: 5px; /* Bords arrondis */
          transition: background 0.3s ease; /* Animation lors du survol */
        }

        .gradient-button:hover {
          background-image: linear-gradient(90deg, #c17b48, #8b4513); /* Inverse le dégradé lors du survol */
        }
      `}</style>

      <Carousel
        dir='ltr'
        plugins={[plugin.current]}
        className='w-full mx-auto'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item.title}>
              <Link href={item.url}>
                <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover'
                    priority
                  />
                  <div className='absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2'>
                    {/* Affichage des titres pour tous les carrousels */}
                    <h2
                      className={cn(
                        'text-xl md:text-3xl mb-4 gradient-text' // Titre en gradient et en taille plus modérée
                      )}
                    >
                      {t(`${item.title}`)}
                    </h2>
                    <Button className='hidden md:block gradient-button'>
                      {t(`${item.buttonCaption}`)}
                    </Button>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0 md:left-12' />
        <CarouselNext className='right-0 md:right-12' />
      </Carousel>
    </>
  )
}
