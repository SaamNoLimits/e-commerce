'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from '@/components/shared/product/product-price'

const shippingAddressDefaultValues = {
  fullName: '',
  street: '',
  city: '',
  province: '',
  phone: '',
  postalCode: '',
  country: '',
};

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {
    setting: {
      site,
      availablePaymentMethods,
      defaultPaymentMethod,
      availableDeliveryDates,
    },
  } = useSettingStore()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = defaultPaymentMethod,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    clearCart,
    setDeliveryDateIndex,
  } = useCartStore()
  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddressDefaultValues,
  })

  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.reset(shippingAddress)
  }, [isMounted, shippingAddress, shippingAddressForm])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false)

  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        availableDeliveryDates[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })
    if (!res.success) {
      toast({
        description: res.message,
        variant: 'destructive',
      })
    } else {
      toast({
        description: res.message,
        variant: 'default',
      })
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }
  }

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }

  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        {!isAddressSelected && (
          <div className='border-b mb-4'>
            <Button
              className='rounded-full w-full hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
              onClick={handleSelectShippingAddress}
            >
              Ship to this address
            </Button>
            <p className='text-xs text-center py-2 text-black hover:no-underline'>
              Choose a shipping address and payment method in order to calculate
              shipping, handling, and tax.
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className=' mb-4'>
            <Button
              className='rounded-full w-full hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
              onClick={handleSelectPaymentMethod}
            >
              Use this payment method
            </Button>

            <p className='text-xs text-center py-2 text-black hover:no-underline'>
              Choose a payment method to continue checking out. You&apos;ll
              still have a chance to review and edit your order before it&apos;s
              final.
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div>
            <Button
              onClick={handlePlaceOrder}
              className='rounded-full w-full hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
            >
              Place Your Order
            </Button>
            <p className='text-xs text-center py-2 text-black hover:no-underline'>
              By placing your order, you agree to {site.name}&apos;s{' '}
              <Link href='/page/privacy-policy' className='hover:no-underline'>
                privacy notice
              </Link>{' '}
              and
              <Link href='/page/conditions-of-use' className='hover:no-underline'>
                {' '}
                conditions of use
              </Link>
              .
            </p>
          </div>
        )}

        <div>
          <div className='text-lg font-bold text-black'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-black'>Items:</span>
              <span className='text-black'>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'>Shipping & Handling:</span>
              <span className='text-black'>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'> Tax:</span>
              <span className='text-black'>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-4 font-bold text-lg'>
              <span className='text-black'> Order Total:</span>
              <span className='text-black'>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto highlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* shipping address */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className='grid grid-cols-1 md:grid-cols-12    my-3  pb-3'>
                <div className='col-span-5 flex text-lg font-bold bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>1 </span>
                  <span>Shipping address</span>
                </div>
                <div className='col-span-5 text-black'>
                  <p>
                    {shippingAddress.fullName} <br />
                    {shippingAddress.street} <br />
                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    className='hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className='flex text-lg font-bold my-2 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>1 </span>
                  <span>Enter shipping address</span>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-4'
                  >
                    <Card className='md:ml-8 my-4'>
                      <CardContent className='p-4 space-y-2'>
                        <div className='text-lg font-bold mb-2 text-black'>
                          Your address
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='fullName'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter full name'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={shippingAddressForm.control}
                            name='street'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter address'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>City</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter city' {...field} className='text-black' />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='province'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Province</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter province'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='country'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter country'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter postal code'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-black'>Phone number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter phone number'
                                    {...field}
                                    className='text-black'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className='  p-4'>
                        <Button
                          type='submit'
                          className='rounded-full font-bold hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                        >
                          Ship to this address
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className='border-y'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>2 </span>
                  <span>Payment Method</span>
                </div>
                <div className='col-span-5 text-black'>
                  <p>{paymentMethod}</p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant='outline'
                    className='hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className='flex text-lg font-bold my-2 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>2 </span>
                  <span>Choose a payment method</span>
                </div>
                <Card className='md:ml-8 my-4'>
                  <CardContent className='p-4'>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {availablePaymentMethods.map((pm) => (
                        <div key={pm.name} className='flex items-center py-1 '>
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className='font-bold pl-2 cursor-pointer text-black hover:no-underline'
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className='rounded-full font-bold hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                    >
                      Use this payment method
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className='flex text-lg font-bold my-4 py-3 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                <span className='w-8'>2 </span>
                <span>Choose a payment method</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>3 </span>
                  <span>Items and shipping</span>
                </div>
                <div className='col-span-5 text-black'>
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          availableDeliveryDates[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} = {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    className='hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-lg font-bold my-2 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                  <span className='w-8'>3 </span>
                  <span>Review items and shipping</span>
                </div>
                <Card className='md:ml-8'>
                  <CardContent className='p-4'>
                    <p className='mb-2 text-black'>
                      <span className='text-lg font-bold text-green-700'>
                        Arriving{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              availableDeliveryDates[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      If you order in the next {timeUntilMidnight().hours} heures
                      et {timeUntilMidnight().minutes} minutes.
                    </p>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        {items.map((item, _index) => (
                          <div key={_index} className='flex gap-4 py-2'>
                            <div className='relative w-16 h-16'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='20vw'
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
                            </div>

                            <div className='flex-1'>
                              <p className='font-semibold text-black'>
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className='font-bold text-black'>
                                <ProductPrice price={item.price} plain />
                              </p>

                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') removeItem(item)
                                  else updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className='w-24 text-black'>
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key='delete' value='0'>
                                    Delete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=' font-bold'>
                          <p className='mb-2 text-black'> Choose a shipping speed:</p>

                          <ul>
                            <RadioGroup
                              value={
                                availableDeliveryDates[deliveryDateIndex!].name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  availableDeliveryDates.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {availableDeliveryDates.map((dd) => (
                                <div key={dd.name} className='flex'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className='pl-2 space-y-2 cursor-pointer text-black hover:no-underline'
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className='text-green-700 font-semibold'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        'FREE Shipping'
                                      ) : (
                                        <ProductPrice
                                          price={dd.shippingPrice}
                                          plain
                                        />
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-lg font-bold my-4 py-3 bg-gradient-to-r from-brown-700 to-brown-500 bg-clip-text text-transparent hover:no-underline'>
                <span className='w-8'>3 </span>
                <span>Items and shipping</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button
                    onClick={handlePlaceOrder}
                    className='rounded-full hover:no-underline bg-gradient-to-r from-brown-700 to-brown-500 text-white'
                  >
                    Place Your Order
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg text-black'>
                      Order Total: <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs text-black hover:no-underline'>
                      {' '}
                      By placing your order, you agree to {
                        site.name
                      }&apos;s{' '}
                      <Link href='/page/privacy-policy' className='hover:no-underline'>
                        privacy notice
                      </Link>{' '}
                      and
                      <Link href='/page/conditions-of-use' className='hover:no-underline'>
                        {' '}
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
export default CheckoutForm