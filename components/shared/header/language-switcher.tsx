'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import useSettingStore from '@/hooks/use-setting-store'
import { i18n } from '@/i18n-config'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { ChevronDownIcon, GlobeIcon } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locales } = i18n
  const locale = useLocale()
  const pathname = usePathname()

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='header-button h-[36px] w-[36px] bg-gradient-to-r  from-[#5f4a30] to-[#9a7546] text-white rounded-full flex items-center justify-center text-sm font-semibold'>
        <GlobeIcon className='text-white' size={18} /> {/* Icône de traduction */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48 bg-gradient-to-r from-[#937348] to-[#c49a64] shadow-md rounded-md p-3 text-sm'>
        {/* Language Selection */}
        <DropdownMenuLabel className='font-medium text-white mb-1 text-base'>
          Language
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale}>
          {locales.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code} className='text-white text-base'>
              <Link
                className='w-full flex items-center gap-2 p-1 rounded-md hover:bg-gradient-to-r from-[#bd9576] to-[#d7ccc8] transition-all focus:outline-none'
                href={pathname}
                locale={c.code}
              >
                <span className='text-md'>{c.icon}</span> {c.name}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className='my-2 bg-[#6a4f3b] dark:bg-[#a47252]' />

        {/* Currency Selection */}
        <DropdownMenuLabel className='font-medium text-white mb-1 text-base'>
          Currency
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={currency} onValueChange={handleCurrencyChange}>
          {availableCurrencies.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code} className='text-white text-base'>
              <span className='text-md'>{c.symbol}</span> {c.code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
