'use client'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { i18n } from '@/i18n-config'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const { locales } = i18n

  const locale = useLocale()
  const t = useTranslations()
  return (
    <footer className='bg-gradient-to-r from-[#ddebf5] via-[#925e2a] to-[#f1e7de] animate-gradient'>
      <div className='w-full'>
        <Button
          variant='ghost'
          className='bg-gradient-to-r from-[#afc7d8] via-[#925e2a] to-[#f1e7de] text-white hover:bg-gradient-to-l transition-all duration-300 w-full rounded-none text-lg' // text-lg
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-6 w-6' /> {/* Taille d'icône augmentée */}
          {t('Footer.Back to top')}
        </Button>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto'> {/* Espacement augmenté */}
          <div>
            <h3 className='font-bold mb-4 text-xl'>{t('Footer.Get to Know Us')}</h3> {/* text-xl */}
            <ul className='space-y-3 text-lg'> {/* text-lg et espacement augmenté */}
              <li>{t('Footer.Careers')}</li>
              <li>{t('Footer.Blog')}</li>
              <li>{t('Footer.About name', { name: site.name })}</li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-4 text-xl'>{t('Footer.Make Money with Us')}</h3>
            <ul className='space-y-3 text-lg'>
              <li>{t('Footer.Sell products on', { name: site.name })}</li>
              <li>{t('Footer.Become an Affiliate')}</li>
              <li>{t('Footer.Advertise Your Products')}</li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-4 text-xl'>{t('Footer.Let Us Help You')}</h3>
            <ul className='space-y-3 text-lg'>
              <li>{t('Footer.Shipping Rates & Policies')}</li>
              <li>{t('Footer.Returns & Replacements')}</li>
              <li>{t('Footer.Help')}</li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800'>
          <div className='max-w-7xl mx-auto py-10 px-6 flex flex-col items-center space-y-6'> {/* Espacement augmenté */}
            <div className='flex items-center space-x-6 flex-wrap md:flex-nowrap'> {/* Espacement augmenté */}
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger className='text-lg min-w-[180px] h-12'> {/* text-lg et taille augmentée */}
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((lang, index) => (
                    <SelectItem key={index} value={lang.code} className='text-lg'> {/* text-lg */}
                      <span>{lang.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                  window.scrollTo(0, 0)
                }}
              >
                <SelectTrigger className='text-lg min-w-[180px] h-12'> {/* text-lg et taille augmentée */}
                  <SelectValue placeholder={t('Footer.Select a currency')} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.filter((x) => x.code).map((currency, index) => (
                    <SelectItem key={index} value={currency.code} className='text-lg'> {/* text-lg */}
                      {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className='p-6'>
        <div className='flex justify-center gap-6 text-lg'> {/* text-lg et espacement augmenté */}
          <span>{t('Footer.Conditions of Use')}</span>
          <span>{t('Footer.Privacy Notice')}</span>
          <span>{t('Footer.Help')}</span>
        </div>
        <div className='flex justify-center text-lg mt-4'> {/* text-lg */}
          <p> © {site.copyright}</p>
        </div>
        <div className='mt-6 flex justify-center text-lg text-gray-400'> {/* text-lg */}
          {site.address} | {site.phone}
        </div>
      </div>
    </footer>
  )
}