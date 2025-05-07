import Link from 'next/link'
import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import { getAllProducts } from '@/lib/actions/product.actions'
import { getTranslations } from 'next-intl/server'

export default async function SearchPage(props) {
  const searchParams = await props.searchParams
  const { q, price, rating, page = '1' } = searchParams
  const params = { q, price, rating, page }

  const data = await getAllProducts({ query: q, price, rating, page: Number(page) })
  const t = await getTranslations()

  return (
    <div>
      <div className='my-2 bg-card md:border-b flex-between flex-col md:flex-row'>
        <div className='flex items-center'>
          {data.totalProducts === 0 ? t('Search.No') : `${data.from}-${data.to} ${t('Search.of')} ${data.totalProducts}`} {t('Search.results')}
          &nbsp;
          {(q && q !== 'all') || price !== 'all' || rating !== 'all' ? (
            <Button variant={'link'} asChild>
              <Link href='/search'>{t('Search.Clear')}</Link>
            </Button>
          ) : null}
        </div>
      </div>
      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        <div className='md:col-span-5 space-y-4'>
          <div>
            <div className='font-bold text-xl'>{t('Search.Results')}</div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {data.products.length === 0 && <div>{t('Search.No product found')}</div>}
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data.totalPages > 1 && <Pagination page={page} totalPages={data.totalPages} />}
        </div>
      </div>
    </div>
  )
}
