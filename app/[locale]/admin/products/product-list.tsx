 // Indique que ce composant est un composant client (utilise des hooks React)
'use client'

// Import des dépendances
import Link from 'next/link' // Composant pour la navigation entre pages
import DeleteDialog from '@/components/shared/delete-dialog' // Composant de dialogue de suppression
import { Button } from '@/components/ui/button' // Composant de bouton personnalisé
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table' // Composants pour créer un tableau
import {
  deleteProduct,
  getAllProductsForAdmin,
} from '@/lib/actions/product.actions' // Actions pour interagir avec les produits
import { IProduct } from '@/lib/db/models/product.model' // Interface TypeScript pour le modèle Produit

import React, { useEffect, useState, useTransition } from 'react' // Hooks React
import { Input } from '@/components/ui/input' // Composant d'input personnalisé
import { formatDateTime, formatId } from '@/lib/utils' // Fonctions utilitaires
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react' // Icônes

// Type pour les données de la liste de produits
type ProductListDataProps = {
  products: IProduct[] // Tableau de produits
  totalPages: number // Nombre total de pages
  totalProducts: number // Nombre total de produits
  to: number // Index du dernier produit sur la page
  from: number // Index du premier produit sur la page
}

// Composant principal de la liste de produits
const ProductList = () => {
  // États pour la pagination et la recherche
  const [page, setPage] = useState<number>(1) // Page courante
  const [inputValue, setInputValue] = useState<string>('') // Valeur de recherche
  const [data, setData] = useState<ProductListDataProps>() // Données des produits
  const [isPending, startTransition] = useTransition() // Pour les transitions React (optimisation)

  // Gère le changement de page
  const handlePageChange = (changeType: 'next' | 'prev') => {
    const newPage = changeType === 'next' ? page + 1 : page - 1
    setPage(newPage)
    startTransition(async () => {
      // Charge les produits pour la nouvelle page
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(data)
    })
  }

  // Gère la recherche lors de la saisie dans l'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value) {
      // Debounce pour éviter des requêtes à chaque frappe
      clearTimeout((window as any).debounce)
      ;(window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 })
          setData(data)
        })
      }, 500)
    } else {
      // Si la recherche est vide, recharge tous les produits
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page })
        setData(data)
      })
    }
  }

  // Effet pour charger les produits au montage du composant
  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: '' })
      setData(data)
    })
  }, [])

  // Rendu du composant
  return (
    <div className="space-y-8 p-8 transition-all duration-500 shadow-xl rounded-xl">
      {/* En-tête avec titre, recherche et bouton de création */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-brown-600">Products</h1>
          <div className="flex items-center gap-4">
            <Input
              className="w-80 py-3 px-4 rounded-lg border border-white shadow-lg focus:ring-2 focus:ring-white placeholder:text-gray-400 transition duration-300 ease-in-out text-lg"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search products..."
            />
            {isPending ? (
              <p className="text-black text-lg">Loading...</p> 
            ) : (
              <p className="text-black font-semibold text-lg">
                {data?.totalProducts === 0
                  ? 'No'
                  : `${data?.from}-${data?.to} of ${data?.totalProducts}`} 
                results
              </p>
            )}
          </div>
        </div>
        <Button 
          asChild 
          variant="default" 
          className="bg-gradient-to-r from-[#69442a] to-[#D2B48C] hover:from-[#8B4513] hover:to-[#D2B48C] text-white font-semibold rounded-lg py-3 px-6 transition duration-300 ease-in-out text-lg">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>

      {/* Tableau des produits */}
      <Table className="w-full bg-gradient-to-r from-brown-600 to-brown-400">
        <TableHeader className="bg-gradient-to-r from-[#9dc3df] via-[#9dc3df] to-[#9dc3df] rounded-t-xl">
          <TableRow>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">ID</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Name</TableHead>
            <TableHead className="py-6 px-8 text-right text-xl font-semibold text-black">Price</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Category</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Stock</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Rating</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Published</TableHead>
            <TableHead className="py-6 px-8 text-left text-xl font-semibold text-black">Last Update</TableHead>
            <TableHead className="py-6 px-8 text-center text-xl font-semibold text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Boucle sur les produits pour afficher chaque ligne */}
          {data?.products.map((product: IProduct) => (
            <TableRow
              key={product._id}
              className="transition-all duration-300 bg-white hover:bg-gray-50 shadow-md rounded-lg"
            >
              <TableCell className="py-6 px-8 text-base text-gray-700">{formatId(product._id)}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">
                <Link href={`/admin/products/${product._id}`} className="text-black-500 hover:text-brown-700 transition duration-300 ease-in-out">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700 text-right">${product.price}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">{product.category}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">{product.countInStock}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">{product.avgRating}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">{product.isPublished ? 'Yes' : 'No'}</TableCell>
              <TableCell className="py-6 px-8 text-base text-gray-700">{formatDateTime(product.updatedAt).dateTime}</TableCell>
              <TableCell className="py-6 px-8 text-center">
                <div className="flex justify-center gap-4">
                  {/* Bouton d'édition */}
                  <Button asChild variant="outline" size="sm" className="text-brown-500 hover:bg-brown-100 transition duration-300 ease-in-out text-base">
                    <Link href={`/admin/products/${product._id}`} className="flex items-center gap-1 animate-pulse">
                      <Pencil size={20} />
                    </Link>
                  </Button>
                  {/* Dialogue de suppression */}
                  <DeleteDialog
                    id={product._id}
                    action={deleteProduct}
                    callbackAction={() => {
                      startTransition(async () => {
                        const data = await getAllProductsForAdmin({
                          query: inputValue,
                        })
                        setData(data)
                      })
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange('prev')}
            disabled={page <= 1}
            className="py-2 px-4 text-base font-medium text-gray-600 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <ChevronLeft /> Prev
          </Button>
          <p className="text-base font-medium text-gray-600">
            Page {page} of {data?.totalPages}
          </p>
          <Button
            variant="outline"
            onClick={() => handlePageChange('next')}
            disabled={page >= data?.totalPages}
            className="py-2 px-4 text-base font-medium text-gray-600 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            Next <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductList