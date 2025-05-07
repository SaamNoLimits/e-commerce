/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import { useToast } from '@/hooks/use-toast'
import { OrderItem } from '@/types'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem
  minimal?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()

  const { addItem } = useCartStore()

  const [quantity, setQuantity] = useState(1)

  const t = useTranslations()

  return minimal ? (
    <Button
      className='bg-gradient-to-r from-[#96673d] to-[#d5a48a] text-white rounded-full w-auto hover:from-[#a67a6a] hover:to-[#D7CCC8] transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg'
      onClick={() => {
        try {
          addItem(item, 1)
          toast({
            description: t('Product.Added to Cart'),
            action: (
              <Button
                onClick={() => {
                  router.push('/cart')
                }}
                className='transition-all duration-300 hover:scale-105'
              >
                {t('Product.Go to Cart')}
              </Button>
            ),
          })
        } catch (error: any) {
          toast({
            variant: 'destructive',
            description: error.message,
          })
        }
      }}
    >
      {t('Product.Add to Cart')}
    </Button>
  ) : (
    <div className='w-full space-y-2 p-4 bg-gradient-to-r from-[#e4d4c7] to-[#e1c9bc] rounded-lg shadow-lg'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
        className='bg-gradient-to-r from-[#87613f] to-[#feede5] rounded-lg shadow-md'
      >
        <SelectTrigger className='text-black'>
          <SelectValue>
            {t('Product.Quantity')}: {quantity}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position='popper' className='bg-gradient-to-r from-[#87613f] to-[#ffd6c1]'>
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`} className='text-white'>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='bg-gradient-to-r from-[#9e7a5b] to-[#d8a089] text-white rounded-full w-full hover:from-[#bc8d64] hover:to-[#eddcd7] transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg'
        type='button'
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity)
            router.push(`/cart/${itemId}`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            })
          }
        }}
      >
        {t('Product.Add to Cart')}
      </Button>
      <Button
        variant='secondary'
        onClick={() => {
          try {
            addItem(item, quantity)
            router.push(`/checkout`)
          } catch (error: any) {
            toast({
              variant: 'destructive',
              description: error.message,
            })
          }
        }}
        className='bg-gradient-to-r from-[#9b7554] to-[#e7a584] text-white w-full rounded-full hover:from-[#c28c5d] hover:to-[#ffefea] transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg'
      >
        {t('Product.Buy Now')}
      </Button>
    </div>
  )
}