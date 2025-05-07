import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  let categories = []
  let site = { logo: '', name: 'Mon Site' }

  try {
    categories = await getAllCategories()
    site = (await getSetting()).site
  } catch (error) {
    console.error('Erreur lors du chargement des données du header:', error)
  }

  const t = await getTranslations()

  return (
    <header className='bg-gradient-to-r from-[#ddebf5] via-[#b0865d] to-[#f1e7de] animate-gradient text-black font-bold text-lg shadow-md'>
      <div className='px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo & Nom */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center font-bold text-xl' style={{ fontFamily: 'Verdana, sans-serif' }}>
              <Image
                src={site.logo || '/default-logo.png'}
                width={80}  // Augmenter la largeur
                height={80} // Augmenter la hauteur
                alt={`${site.name} logo`}
                priority={true}
                className='rounded-md w-12 h-12 md:w-16 md:h-16' // Classes pour ajuster la taille du logo selon la taille de l'écran
              />
              <span className='ml-2'>{site.name}</span>
            </Link>
          </div>

          {/* Barre de recherche */}
          <div className='hidden md:block flex-1 max-w-lg'>
            <Search />
          </div>

          {/* Menu */}
          <Menu />
        </div>

        {/* Barre de recherche pour mobile */}
        <div className='md:hidden block py-2'>
          <Search />
        </div>
      </div>

      {/* Navigation avec les catégories */}
      <div className='flex items-center justify-center px-4 from-[#ffcd8c] via-[#ffcd8c] to-[#ffffff] animate-gradient'>
        <div className='flex items-center flex-wrap gap-3 overflow-x-auto max-w-full py-2'>
          {data.headerMenus.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className='px-3 py-1 text-black  l hover:text-[#333333] transition-colors duration-200'
              style={{ fontFamily: 'Verdana, sans-serif' }} // Appliquer Verdana aux liens
            >
              {t('Header.' + menu.name)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
