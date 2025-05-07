'use client'

// Importation des composants nécessaires
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Importation des hooks pour gérer l'état du panier et des paramètres
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CartPage() {
  // Récupération des données du panier depuis le store
  const {
    cart: { items, itemsPrice }, // items : produits dans le panier, itemsPrice : prix total
    updateItem, // Fonction pour mettre à jour la quantité d'un produit
    removeItem, // Fonction pour supprimer un produit du panier
  } = useCartStore()

  // Initialisation du routeur pour naviguer entre les pages
  const router = useRouter()

  // Récupération des paramètres du site, notamment le seuil pour la livraison gratuite
  const {
    setting: {
      site,
      common: { freeShippingMinPrice }, // Prix minimum pour obtenir la livraison gratuite
    },
  } = useSettingStore()

  // Gestion des traductions
  const t = useTranslations()

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
        {/* Si le panier est vide, afficher un message */}
        {items.length === 0 ? (
          <Card className='col-span-4 rounded-none'>
            <CardHeader className='text-3xl'>
              {t('Cart.Your Shopping Cart is empty')}
            </CardHeader>
            <CardContent>
              {t.rich('Cart.Continue shopping on', {
                name: site.name,
                home: (chunks) => <Link href='/'>{chunks}</Link>,
              })}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Section principale du panier */}
            <div className='col-span-3'>
              <Card className='rounded-none'>
                <CardHeader className='text-3xl pb-0'>
                  {t('Cart.Shopping Cart')}
                </CardHeader>
                <CardContent className='p-4'>
                  <div className='flex justify-end border-b mb-4'>
                    {t('Cart.Price')}
                  </div>

                  {/* Affichage des produits dans le panier */}
                  {items.map((item) => (
                    <div key={item.clientId} className='flex flex-col md:flex-row justify-between py-4 border-b gap-4'>
                      {/* Image du produit */}
                      <Link href={`/product/${item.slug}`}>
                        <div className='relative w-40 h-40'>
                          <Image src={item.image} alt={item.name} fill sizes='20vw' style={{ objectFit: 'contain' }} />
                        </div>
                      </Link>

                      {/* Détails du produit */}
                      <div className='flex-1 space-y-4'>
                        <Link href={`/product/${item.slug}`} className='text-lg hover:no-underline'>
                          {item.name}
                        </Link>
                        <div>
                          <p className='text-sm'><span className='font-bold'>{t('Cart.Color')}:</span> {item.color}</p>
                          <p className='text-sm'><span className='font-bold'>{t('Cart.Size')}:</span> {item.size}</p>
                        </div>

                        {/* Sélection de la quantité */}
                        <div className='flex gap-2 items-center'>
                          <Select value={item.quantity.toString()} onValueChange={(value) => updateItem(item, Number(value))}>
                            <SelectTrigger className='w-auto'>
                              <SelectValue>{t('Cart.Quantity')}: {item.quantity}</SelectValue>
                            </SelectTrigger>
                            <SelectContent position='popper'>
                              {Array.from({ length: item.countInStock }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Bouton de suppression du produit */}
                          <Button variant={'outline'} onClick={() => removeItem(item)} className='bg-gradient-to-r from-[#8B4513] to-[#D2B48C] text-white hover:from-[#D2B48C] hover:to-[#8B4513]'>
                            {t('Cart.Delete')}
                          </Button>
                        </div>
                      </div>

                      {/* Prix du produit multiplié par sa quantité */}
                      <div>
                        <p className='text-right'>
                          {item.quantity > 1 && (
                            <>
                              {item.quantity} x <ProductPrice price={item.price} plain />
                              <br />
                            </>
                          )}
                          <span className='font-bold text-lg'>
                            <ProductPrice price={item.price * item.quantity} plain />
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Sous-total */}
                  <div className='flex justify-end text-lg my-2'>
                    {t('Cart.Subtotal')} ({items.reduce((acc, item) => acc + item.quantity, 0)} {t('Cart.Items')}):
                    <span className='font-bold ml-1'>
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      {/* Historique de navigation */}
      <BrowsingHistoryList className='mt-10' />
    </div>
  )
}