import type { ReactNode } from 'react'
import { CartProvider } from '@/components/order/cart-context'

export default function OrderLayout({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
