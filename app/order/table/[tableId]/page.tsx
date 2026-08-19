'use client'

import { useParams, useRouter } from 'next/navigation'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useCart } from '@/components/order/cart-context'
import { restaurantProfile } from '@/lib/mock-data'
import { UtensilsCrossed } from 'lucide-react'

export default function QrTableEntryPage() {
  const params = useParams<{ tableId: string }>()
  const router = useRouter()
  const { setTableNumber } = useCart()

  function handleContinue() {
    setTableNumber(params.tableId)
    router.push(`/order/menu?table=${params.tableId}`)
  }

  return (
    <div className="flex min-h-dvh flex-col page-canvas">
      <header className="flex items-center justify-between px-4 py-3">
        <AirestsMark size="lg" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
          <UtensilsCrossed className="size-8 text-accent-foreground" />
        </div>
        <p className="mt-5 text-sm font-medium text-primary">You&apos;re ordering for</p>
        <h1 className="mt-1 font-sans text-3xl font-semibold tracking-tight text-foreground">Table {params.tableId}</h1>
        <p className="mt-1.5 text-base font-medium text-foreground">{restaurantProfile.name}</p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Browse the full menu, add items to your order, and it will be sent directly to our kitchen for Table {params.tableId}.
          No need to flag down your server.
        </p>

        <button
          onClick={handleContinue}
          className="mt-8 w-full max-w-xs rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Start Ordering
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Not your table? <span className="font-medium text-foreground">Ask your server for help.</span>
        </p>
      </div>
    </div>
  )
}
