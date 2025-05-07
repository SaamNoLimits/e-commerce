import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[] 
    image: string
    href: string
  }[] 
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4'>
      {cards.map((card) => (
        <Card key={card.title} className='rounded-none flex flex-col p-2'>
          <CardContent className='p-4 flex-1'>
            <h3 className='text-xl font-bold mb-4'>{card.title}</h3>
            <div className='grid grid-cols-2 gap-2'>
              {card.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='flex flex-col items-center'
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className='aspect-square object-cover max-w-[80px] h-[80px] mx-auto'
                    height={80}  // Reduces the image size
                    width={80}   // Reduces the image size
                  />
                  <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          {card.link && (
            <CardFooter>
              <Link href={card.link.href} className='mt-4 block text-xs'>
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
