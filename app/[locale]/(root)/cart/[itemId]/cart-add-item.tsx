 'use client' // Indique que ce composant s'exécute côté client.

import BrowsingHistoryList from '@/components/shared/browsing-history-list' // Composant qui affiche l'historique de navigation.
import ProductPrice from '@/components/shared/product/product-price' // Composant pour afficher le prix du produit.
import { buttonVariants } from '@/components/ui/button' // Variantes de style pour les boutons.
import { Card, CardContent } from '@/components/ui/card' // Composants UI pour afficher des cartes.
import { cn } from '@/lib/utils' // Fonction utilitaire pour concaténer des classes CSS.
import { CheckCircle2Icon } from 'lucide-react' // Icône d'un cercle avec une coche (Check ✅).
import Image from 'next/image' // Composant d'image optimisée pour Next.js.
import Link from 'next/link' // Composant pour la navigation interne.
import { notFound } from 'next/navigation' // Fonction pour afficher une page 404 si l'élément n'existe pas.
import useCartStore from '@/hooks/use-cart-store' // Hook pour gérer l'état du panier.
import useSettingStore from '@/hooks/use-setting-store' // Hook pour récupérer les paramètres du site.
import { useTranslations } from 'next-intl' // Hook pour la gestion des traductions.

export default function CartAddItem({ itemId }: { itemId: string }) {
  // Récupérer les articles du panier et le prix total
  const {
    cart: { items, itemsPrice },
  } = useCartStore()

  // Récupérer les paramètres de la boutique, notamment le montant minimum pour la livraison gratuite
  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  // Trouver l'article ajouté dans le panier
  const item = items.find((x) => x.clientId === itemId)

  // Hook pour gérer les traductions
  const t = useTranslations()

  // Si l'article n'existe pas dans le panier, afficher une page 404
  if (!item) return notFound()

  return (
    <div>
      {/* Disposition en grille pour organiser l'affichage sur desktop */}
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>

        {/* Carte affichant les détails de l'article ajouté */}
        <Card className='w-full rounded-none'>
          <CardContent className='flex h-full items-center justify-center gap-3 py-4'>
            {/* Lien vers la page du produit */}
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Link>
            <div>
              {/* Message confirmant l'ajout au panier */}
              <h3 className='text-xl font-bold flex gap-2 my-2'>
                <CheckCircle2Icon className='h-6 w-6 text-green-700' />
                {t('Cart.Added to cart')}
              </h3>

              {/* Affichage de la couleur et de la taille du produit */}
              <p className='text-sm'>
                <span className='font-bold'> {t('Cart.Color')}: </span>{' '}
                {item.color ?? '-'}
              </p>
              <p className='text-sm'>
                <span className='font-bold'> {t('Cart.Size')}: </span>{' '}
                {item.size ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Carte affichant les informations sur la livraison gratuite et le total du panier */}
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 h-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div className='flex justify-center items-center'>
                {/* Message indiquant combien il manque pour bénéficier de la livraison gratuite */}
                {itemsPrice < freeShippingMinPrice ? (
                  <div className='text-center '>
                    {t('Cart.Add')}{' '}
                    <span className='text-green-700'>
                      <ProductPrice
                        price={freeShippingMinPrice - itemsPrice}
                        plain
                      />
                    </span>{' '}
                    {t('Cart.of eligible items to your order to qualify for FREE Shipping')}
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <div>
                      <span className='text-green-700'>
                        Your order qualifies for FREE Shipping.
                      </span>{' '}
                      Choose this option at checkout.
                    </div>
                  </div>
                )}
              </div>

              {/* Bloc contenant le sous-total du panier et les boutons de navigation */}
              <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3'>
                {/* Affichage du sous-total */}
                <div className='flex gap-3'>
                  <span className='text-lg font-bold'>Cart Subtotal:</span>
                  <ProductPrice className='text-2xl' price={itemsPrice} />
                </div>

                {/* Bouton pour aller au paiement */}
                <Link
                  href='/checkout'
                  className={cn(buttonVariants(), 'rounded-full w-full')}
                >
                  Proceed to checkout (
                  {items.reduce((a, c) => a + c.quantity, 0)} items)
                </Link>

                {/* Bouton pour aller au panier */}
                <Link
                  href='/cart'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  {t('Cart.Go to Cart')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Afficher l'historique de navigation */}
      <BrowsingHistoryList />
    </div>
  )
}
