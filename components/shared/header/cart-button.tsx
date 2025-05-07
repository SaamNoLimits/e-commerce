'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations()

  const locale = useLocale()

  return (
    <Link href='/cart' className='relative px-2 py-1 header-button rounded-md flex items-center gap-1 bg-gradient-to-r from-brown-600 to-beige-200 hover:from-brown-700 hover:to-beige-300 transition-all shadow-md text-sm transform hover:scale-105'>
      <ShoppingCartIcon className='h-5 w-5 text-black dark:text-white' />

      {isMounted && (
        <span
          className={cn(
            `bg-black text-white rounded-full absolute ${
              getDirection(locale) === 'rtl' ? 'right-[4px]' : 'left-[8px]'
            } top-[-3px] z-10 text-xs font-bold flex items-center justify-center px-1 py-[2px]`,
            cartItemsCount >= 10 && 'text-[10px] px-1'
          )}
        >
          {cartItemsCount}
        </span>
      )}

      <span className='font-semibold text-black dark:text-white text-xs'>{t('Header.Cart')}</span>

      {showSidebar && (
        <div
          className={`absolute top-[16px] ${
            getDirection(locale) === 'rtl' ? 'left-[-12px] rotate-[-270deg]' : 'right-[-12px] rotate-[-90deg]'
          } z-10 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[7px] border-transparent border-b-background transition-all`}></div>
      )}
    </Link>
  )
}
