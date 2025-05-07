import { EllipsisVertical } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import UserButton from './user-button'
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations()
  return (
    <div className='flex justify-end p-4'>
      {/* Desktop navigation */}
      <nav className='md:flex gap-4 hidden w-full items-center justify-end'>
        <LanguageSwitcher className="text-gray-900 hover:text-gray-700 transition duration-200" />
        <UserButton className='scale-90 text-gray-900 hover:text-gray-700 transition duration-200' />
        {forAdmin ? null : <CartButton className='scale-90 text-gray-900 hover:text-gray-700 transition duration-200' />}
      </nav>

      {/* Mobile menu */}
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='header-button p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition duration-200'>
            <EllipsisVertical className='h-5 w-5' />
          </SheetTrigger>

          <SheetContent className='bg-white text-gray-900 flex flex-col items-start p-6 space-y-4'>
            <SheetHeader className='w-full'>
              <div className='flex items-center justify-between'>
                <SheetTitle className="text-lg font-semibold">{t('Header.Site Menu')}</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">{t('Header.Menu Options')}</SheetDescription>
              </div>
            </SheetHeader>

            {/* Menu items in mobile */}
            <div className="flex flex-col gap-3 w-full">
              <LanguageSwitcher className="text-gray-900 hover:text-gray-700 transition duration-200" />
              <UserButton className="text-gray-900 hover:text-gray-700 transition duration-200" />
              {forAdmin ? null : <CartButton className="text-gray-900 hover:text-gray-700 transition duration-200" />}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
