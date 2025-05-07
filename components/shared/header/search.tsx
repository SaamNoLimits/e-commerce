import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Search() {
  const {
    site: { name },
  } = await getSetting()

  const t = await getTranslations()
  
  return (
    <form action='/search' method='GET' className='flex items-center space-x-4 h-12'>
      {/* Search Input */}
      <Input
        className='flex-1 bg-transparent text-black dark:text-white text-base h-full px-4 py-2 placeholder:text-gray-400 focus:outline-none'
        placeholder={t('Header.Search Site', { name })}
        name='q'
        type='search'
      />

      {/* Search Button */}
      <button
        type='submit'
        className='bg-transparent text-primary hover:text-primary-dark p-2 h-full flex items-center justify-center focus:outline-none'
      >
        <SearchIcon className='w-6 h-6' />
      </button>
    </form>
  )
}
