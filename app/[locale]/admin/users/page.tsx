import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { IUser } from '@/lib/db/models/user.model'
import { formatId } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Users',
}

export default async function AdminUser(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')
  const page = Number(searchParams.page) || 1
  const users = await getAllUsers({ page })

  return (
    <div className='space-y-6 p-6 rounded-xl shadow-lg'>
      <h1 className='text-[32px] font-bold text-gray-800'>Users Management</h1>

      {/* Tableau avec une couleur de fond blanc */}
      <div className='overflow-hidden bg-white rounded-xl'>
        <Table className='w-full text-left'>
          <TableHeader className="bg-gradient-to-r from-[#a3c7e2] via-[#9bc0df] to-[#9ccdef] rounded-t-xl">
            <TableRow>
              <TableHead className='p-5 text-black text-xl font-semibold'>Id</TableHead>
              <TableHead className='p-5 text-black text-xl font-semibold'>Name</TableHead>
              <TableHead className='p-5 text-black text-xl font-semibold'>Email</TableHead>
              <TableHead className='p-5 text-black text-xl font-semibold'>Role</TableHead>
              <TableHead className='p-5 text-black text-xl font-semibold text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((user: IUser) => (
              <TableRow key={user._id} className='border-b hover:bg-gray-50'>
                <TableCell className='p-5 text-gray-700 text-lg'>{formatId(user._id)}</TableCell>
                <TableCell className='p-5 font-medium text-lg'>{user.name}</TableCell>
                <TableCell className='p-5 text-gray-700 text-lg'>{user.email}</TableCell>
                <TableCell className='p-5'>
                  <span className={`px-4 py-2 rounded-full text-base font-semibold 
                    ${user.role === 'Admin' ? 'bg-[#cba890] text-[#6a4f3b]' : 'bg-[#f5e1d4] text-[#b48d70]'}`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className='p-5 flex justify-center gap-4'>
                  <Button 
                    asChild 
                    variant='ghost' 
                    size='icon' 
                    className='text-[#6a4f3b] hover:text-[#4e3629] hover:bg-[#f5e1d4]/50 h-10 w-10'
                  >
                    <Link href={`/admin/users/${user._id}`}>
                      <Pencil className='w-5 h-5' />
                    </Link>
                  </Button>
                  <DeleteDialog id={user._id} action={deleteUser}>
                    <Button 
                      variant='ghost' 
                      size='icon' 
                      className='text-[#6a4f3b] hover:text-[#4e3629] hover:bg-[#f5e1d4]/50 h-10 w-10'
                    >
                      <Trash2 className='w-5 h-5' />
                    </Button>
                  </DeleteDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users?.totalPages > 1 && (
        <Pagination page={page} totalPages={users?.totalPages} />
      )}
    </div>
  )
}