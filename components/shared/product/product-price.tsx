 // 'use client' indique que ce composant est destiné à être exécuté côté client (en particulier avec Next.js 13+).
'use client'

// Importation du hook personnalisé 'useSettingStore' pour accéder aux paramètres de l'application (comme la devise).
import useSettingStore from '@/hooks/use-setting-store'
// Importation de fonctions utilitaires pour la manipulation des classes CSS (cn) et pour arrondir les nombres à 2 décimales (round2).
import { cn, round2 } from '@/lib/utils'
// Importation des hooks de gestion des traductions et des formats de données depuis 'next-intl'.
import { useFormatter, useTranslations } from 'next-intl'

// Définition du composant `ProductPrice` qui affiche le prix d'un produit, avec diverses options.
const ProductPrice = ({
  price,               // Le prix actuel du produit.
  className,           // La classe CSS optionnelle pour personnaliser le style du prix.
  listPrice = 0,       // Le prix barré du produit (souvent le prix initial ou de référence), par défaut à 0.
  isDeal = false,      // Si `true`, cela indique qu'il s'agit d'une offre spéciale.
  forListing = true,   // Si `true`, le prix est formaté pour un affichage dans une liste (par exemple, aligné au centre).
  plain = false,       // Si `true`, le prix est affiché sans détails supplémentaires comme la remise.
}: {
  price: number        // Le prix réel du produit (obligatoire).
  isDeal?: boolean     // Indique si c'est une offre spéciale (facultatif).
  listPrice?: number   // Le prix original du produit (facultatif).
  className?: string   // Classe CSS facultative pour personnaliser le style.
  forListing?: boolean // Indique si le prix est destiné à être affiché dans une liste (facultatif).
  plain?: boolean      // Affiche uniquement le prix sans autres détails (facultatif).
}) => {
  // Récupère la devise actuelle à partir du store (hook personnalisé).
  const { getCurrency } = useSettingStore()
  const currency = getCurrency()
  // Récupère les fonctions de traduction et de formatage des données.
  const t = useTranslations()
  // Conversion du prix actuel et du prix barré en fonction du taux de conversion de la devise.
  const convertedPrice = round2(currency.convertRate * price)
  const convertedListPrice = round2(currency.convertRate * listPrice)

  // Utilisation de la fonction `useFormatter` pour formater les prix et afficher les valeurs sous forme de devise.
  const format = useFormatter()
  // Calcul du pourcentage de remise basé sur le prix actuel et le prix barré.
  const discountPercent = Math.round(
    100 - (convertedPrice / convertedListPrice) * 100
  )
  // Conversion du prix en chaîne pour séparer les parties entière et décimale.
  const stringValue = convertedPrice.toString()
  const [intValue, floatValue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '']

  // Si `plain` est vrai, le prix est affiché de manière simple avec le symbole de la devise.
  return plain ? (
    format.number(convertedPrice, {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'narrowSymbol', // Affiche la devise sous forme de symbole court.
    })
  ) : convertedListPrice == 0 ? (
    // Si le prix barré est égal à 0 (pas de remise ou prix initial), afficher seulement le prix avec la devise.
    <div className={cn('text-3xl', className)}>
      <span className='text-xs align-super'>{currency.symbol}</span>
      {intValue}
      <span className='text-xs align-super'>{floatValue}</span>
    </div>
  ) : isDeal ? (
    // Si `isDeal` est vrai (offre spéciale), affiche le prix avec la remise et le prix barré.
    <div className='space-y-2'>
      {/* Affiche un badge de remise en pourcentage et un message "Offre limitée" */}
      <div className='flex justify-center items-center gap-2'>
        <span className='bg-red-700 rounded-sm p-1 text-white text-sm font-semibold'>
          {discountPercent}% {t('Product.Off')} {/* Affiche le pourcentage de remise */}
        </span>
        <span className='text-red-700 text-xs font-bold'>
          {t('Product.Limited time deal')} {/* Affiche un message indiquant que c'est une offre limitée */}
        </span>
      </div>
      {/* Affiche le prix actuel et le prix barré, avec des styles spécifiques */}
      <div
        className={`flex ${forListing && 'justify-center'} items-center gap-2`}
      >
        <div className={cn('text-3xl', className)}>
          <span className='text-xs align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-xs align-super'>{floatValue}</span>
        </div>
        {/* Affiche le prix barré formaté */}
        <div className='text-muted-foreground text-xs py-2'>
          {t('Product.Was')}:{' '}
          <span className='line-through'>
            {format.number(convertedListPrice, {
              style: 'currency',
              currency: currency.code,
              currencyDisplay: 'narrowSymbol',
            })}
          </span>
        </div>
      </div>
    </div>
  ) : (
    // Si ce n'est pas une offre spéciale, affiche simplement le prix avec le prix barré
    <div className=''>
      <div className='flex justify-center gap-3'>
        <div className='text-3xl text-orange-700'>-{discountPercent}%</div>
        <div className={cn('text-3xl', className)}>
          <span className='text-xs align-super'>{currency.symbol}</span>
          {intValue}
          <span className='text-xs align-super'>{floatValue}</span>
        </div>
      </div>
      {/* Affiche le prix barré formaté */}
      <div className='text-muted-foreground text-xs py-2'>
        {t('Product.List price')}:{' '}
        <span className='line-through'>
          {format.number(convertedListPrice, {
            style: 'currency',
            currency: currency.code,
            currencyDisplay: 'narrowSymbol',
          })}
        </span>
      </div>
    </div>
  )
}

export default ProductPrice
