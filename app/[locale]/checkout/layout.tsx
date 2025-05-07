import React from 'react'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='p-4'>
      <header className='bg-gradient-to-r from-[#d7ccc8] via-[#6a4f3b] to-[#d7ccc8] text-gray-800 shadow-md animate-gradient mb-4 border-b'>
        <div className='max-w-6xl mx-auto flex justify-center items-center'>
          <h1 className='text-3xl text-white font-bold'>Checkout</h1>
        </div>
      </header>
      {children}
    </div>
  )
}
