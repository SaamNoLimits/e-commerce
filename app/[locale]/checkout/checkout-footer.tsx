import useSettingStore from '@/hooks/use-setting-store'
import Link from 'next/link'
import React from 'react'

export default function CheckoutFooter() {
  const {
    setting: { site },
  } = useSettingStore()
  return (
    <div className='border-t-2 space-y-2 my-4 py-4'>
      <p>
        Need help? Check our <Link href='/page/help'>Help Center</Link> or{' '}
        <Link href='/page/contact-us'>Contact Us</Link>{' '}
      </p>
      <p>
      When you click the 'Place Your Order' button, we will send you an e-mail confirming the receipt of your order. Please note that your contract for the purchase will only be finalized once we send you a shipping confirmation email. By placing your order, you agree to HandTerra's privacy policy and terms of use.

You may return any new, unopened items in their original condition within 30 days of delivery. Some exceptions and restrictions may apply. Please refer to HandTerra's Returns Policy for more details.
      </p>
      <p>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exceptions and restrictions apply.{' '}
        <Link href='/page/returns-policy'>
          See {site.name}&apos;s Returns Policy.
        </Link>
      </p>
    </div>
  )
}
