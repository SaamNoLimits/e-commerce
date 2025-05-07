'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import ActionButton from '../action-button'
import { deliverOrder, updateOrderToPaid } from '@/lib/actions/order.actions'

export default function OrderDetailsForm({ order, isAdmin }: { order: IOrder; isAdmin: boolean }) {
  const { shippingAddress, items, paymentMethod, isPaid, paidAt, isDelivered, deliveredAt, expectedDeliveryDate } = order

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-8 bg-gray-100">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <Card className="mb-6 border border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p className="text-gray-700">{shippingAddress.fullName} - {shippingAddress.phone}</p>
            <p className="text-sm text-gray-500">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
            <div className="mt-4">
              {isDelivered ? (
                <Badge className="bg-green-500 text-white px-3 py-1 rounded-md">Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
              ) : (
                <Badge className="bg-red-500 text-white px-3 py-1 rounded-md">Not delivered</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <p className="text-gray-700">{paymentMethod}</p>
            <div className="mt-4">
              {isPaid ? (
                <Badge className="bg-yellow-500 text-white px-3 py-1 rounded-md">Paid at {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge className="bg-gray-500 text-white px-3 py-1 rounded-md">Not paid</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Order Items</h2>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600">Item</TableHead>
                  <TableHead className="text-gray-600">Quantity</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug} className="hover:bg-gray-50">
                    <TableCell className="flex items-center space-x-4">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-lg" />
                      <span className="text-gray-700 font-medium">{item.name}</span>
                    </TableCell>
                    <TableCell className="text-center text-gray-700">{item.quantity}</TableCell>
                    <TableCell className="text-right text-gray-700">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {isAdmin && ( (isPaid && !isDelivered) || (!isPaid && paymentMethod === 'Cash On Delivery')) && (
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col space-y-4">
            {isAdmin && !isPaid && paymentMethod === 'Cash On Delivery' && (
              <ActionButton
                caption="Mark as Paid"
                action={() => updateOrderToPaid(order._id)}
                className="w-full bg-green-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-green-700 transition"
              />
            )}
            {isAdmin && isPaid && !isDelivered && (
              <ActionButton
                caption="Mark as Delivered"
                action={() => deliverOrder(order._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
