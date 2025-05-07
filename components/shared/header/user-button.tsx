import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, UserIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function UserButton() {
  const t = await getTranslations()
  const session = await auth()

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger className='header-button'>
          <div className='flex items-center cursor-pointer'>
            {/* Icône de compte plus grande avec une couleur spécifique */}
            <UserIcon className='w-10 h-10 text-[#4e391f] drop-shadow-lg' />
            <ChevronDownIcon className='text-[#573f20]' />
          </div>
        </DropdownMenuTrigger>

        {session ? (
          <DropdownMenuContent className='w-56 bg-gradient-to-r from-[#7a603d] to-[#e6bd89] shadow-md rounded-md p-3 text-xl font-[Verdana] text-white'>
            {/* Texte en blanc, Verdana, taille augmentée à 'text-xl' */}
            <DropdownMenuGroup>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem className='hover:bg-gradient-to-r from-[#6a4f3b] to-[#d7ccc8]'>
                  {t('Header.Your orders')}
                </DropdownMenuItem>
              </Link>

              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/products'>
                  <DropdownMenuItem className='hover:bg-gradient-to-r from-[#6a4f3b] to-[#d7ccc8]'>
                    {t('Header.Admin')}
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>

            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button className='w-full py-4 px-2 h-4 justify-start' variant='ghost'>
                  {t('Header.Sign out')}
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-56 bg-gradient-to-r from-[#6a4f3b] to-[#d7ccc8] shadow-md rounded-md p-3 text-xl font-[Verdana] text-white'>
            {/* Texte en blanc, Verdana, taille augmentée à 'text-xl' */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link className={cn(buttonVariants(), 'w-full text-white font-[Verdana]')} href='/sign-in'>
                  {t('Header.Sign in')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='font-normal'>
                {t('Header.New Customer')}?{' '}
                <Link href='/sign-up' className='text-white'>
                  {t('Header.Sign up')}
                </Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
