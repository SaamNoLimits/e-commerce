'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/actions/user.actions'
import { USER_ROLES } from '@/lib/constants'
import { IUser } from '@/lib/db/models/user.model'
import { UserUpdateSchema } from '@/lib/validator'

const UserEditForm = ({ user }: { user: IUser }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: user,
  })

  const { toast } = useToast()
  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    try {
      const res = await updateUser({
        ...values,
        _id: user._id,
      })
      if (!res.success)
        return toast({
          variant: 'destructive',
          description: res.message,
        })

      toast({
        description: res.message,
      })
      form.reset()
      router.push(`/admin/users`)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
      })
    }
  }

  return (
    <div className='max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md'>
      <Form {...form}>
        <form
          method='post'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter user name'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2 rounded-md'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter user email'
                    {...field}
                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2 rounded-md'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className='space-y-2'
                  >
                    {USER_ROLES.map((role) => (
                      <div key={role} className='flex items-center space-x-2'>
                        <RadioGroupItem
                          id={role}
                          value={role}
                          className='h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                        />
                        <label htmlFor={role} className='text-sm'>
                          {role}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
            <Button
              type='submit'
              className="w-full mt-6 bg-gradient-to-r from-[#48577e] to-[#85addd] hover:from-[#8B4513] hover:to-[#D2B48C] focus:ring-[#8B4513]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Submitting...' : `Update User`}
            </Button>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push(`/admin/users`)}
              className='w-full sm:w-auto text-sm'
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UserEditForm
