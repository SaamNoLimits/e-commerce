'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import { useState } from 'react'
import Link from 'next/link'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: [], // Image par défaut supprimée
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [], 
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const images = form.watch('images')

  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/products`)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/products" className="text-blue-600 hover:underline">Products</Link>
        <span className="mx-1">›</span>
        <Link href="/admin/products/create" className="text-blue-600 hover:underline">Create</Link>
      </div>

      <div className="my-8">
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#1d5c88] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-black mb-6">
            {type === 'Create' ? 'Create Product' : 'Update Product'}
          </h1>
          <Form {...form}>
            <form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Slug</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter product slug"
                            className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200 pl-8"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              form.setValue('slug', toSlug(form.getValues('name')))
                            }}
                            className="absolute right-2 top-2.5 text-sm text-blue-600 hover:underline"
                          >
                            Generate
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product brand"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="listPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">List Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product list price"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Net Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product price"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="countInStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Count In Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter product count in stock"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-black">Images</FormLabel>
                      <Card className="rounded-lg shadow-sm bg-brown-800">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap gap-3">
                            {images.map((image: string) => (
                              <div key={image} className="relative w-16 h-16 rounded-lg shadow-sm bg-gray-200 flex items-center justify-center">
                                <Image
                                  src={image}
                                  alt="product image"
                                  className="w-full h-full object-cover rounded-lg"
                                  width={100}
                                  height={100}
                                  loading="lazy"
                                />
                              </div>
                            ))}
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full max-w-xs h-20 border-2 border-[#62a4d3] border-dashed rounded-lg cursor-pointer bg-gradient-to-r from-[#62a4d3] to-[#568dda] hover:from-[#62a4d3] hover:to-[#addcee] mx-auto">
                                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                    <svg
                                      className="w-6 h-6 mb-2 text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 20 16"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
                                      />
                                    </svg>
                                    <p className="mb-1 text-xs text-white">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xxs text-white">SVG, PNG, JPG or GIF</p>
                                  </div>
                                  <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                      form.setValue('images', [...images, res[0].url])
                                      setUploadProgress(0)
                                    }}
                                    onUploadError={(error: Error) => {
                                      toast({
                                        variant: 'destructive',
                                        description: `ERROR! ${error.message}`,
                                      })
                                      setUploadProgress(0)
                                    }}
                                    onUploadProgress={(progress: number) => {
                                      setUploadProgress(progress)
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </FormControl>
                          </div>
                          {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full mt-4">
                              <div
                                className="bg-gradient-to-r from-[#2e62a5] to-[#6782e3] text-xs font-medium text-brown-100 text-center p-0.5 leading-none rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              >
                                {uploadProgress}%
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="rounded-lg border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                          {...field}
                        />
                      </FormControl>
                      
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-brown-300 focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
                        />
                      </FormControl>
                      <FormLabel className="text-black">Is Published?</FormLabel>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-[#3c77a0] to-[#247dbd] hover:from-[#62a4d3] hover:to-[#62a4d3] focus:ring-[#62a4d3]"
              >
                {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm