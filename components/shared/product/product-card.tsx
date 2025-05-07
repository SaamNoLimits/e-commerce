import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative h-52 overflow-hidden rounded-xl transition-all duration-500 hover:scale-110 hover:rotate-1">
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="80vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
      </div>
    </Link>
  )

  const ProductDetails = () => (
    <div className="flex-1 space-y-2 text-gray-800">
      <p className="font-semibold text-sm text-gray-600">{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className="text-base font-medium hover:text-blue-600 transition-all duration-300"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className="flex gap-2 justify-center text-sm text-gray-500">
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )

  const AddButton = () => (
    <div className="w-full text-center mt-2">
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
        className="btn-marron"
      />
    </div>
  )

  return (
    <Card className="w-full flex flex-col rounded-2xl shadow-xl bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="p-3">
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-4 flex-1 text-center">
            <ProductDetails />
          </CardContent>
          {!hideAddToCart && (
            <CardFooter className="p-3">
              <AddButton />
            </CardFooter>
          )}
        </>
      )}
    </Card>
  )
}

export default ProductCard
