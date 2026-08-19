'use client'

import Link from 'next/link'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Stagger, StaggerItem } from '@/components/motion/primitives'
import { CreditCard, ChefHat, LayoutDashboard, ShoppingBag, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const surfaces: {
  title: string
  description: string
  icon: LucideIcon
  href: string
  screens: { label: string; href: string }[]
}[] = [
  {
    title: 'Windows POS',
    description: 'Register for servers and bartenders — orders, floor, tender, and time clock.',
    icon: CreditCard,
    href: '/pos/login',
    screens: [
      { label: 'Login / PIN Entry', href: '/pos/login' },
      { label: 'Order Type & Home', href: '/pos' },
      { label: 'Floor Plan', href: '/pos/floor-plan' },
      { label: 'Order Building', href: '/pos/order' },
      { label: 'Check / Split', href: '/pos/checkout' },
      { label: 'Payment / Tender', href: '/pos/payment' },
      { label: 'Void Flow', href: '/pos/void' },
      { label: 'Offline Mode', href: '/pos/offline' },
      { label: 'Cash Drawer', href: '/pos/cash-drawer' },
      { label: 'Transfers', href: '/pos/transfer' },
      { label: 'Time Clock', href: '/pos/clock' },
      { label: 'Print / KOT', href: '/pos/print' },
    ],
  },
  {
    title: 'Kitchen Display',
    description: 'Station tickets, timers, and expo — grill, fry, salad, and bar.',
    icon: ChefHat,
    href: '/kds',
    screens: [
      { label: 'Expo — All Stations', href: '/kds' },
      { label: 'Grill Station', href: '/kds/grill' },
      { label: 'Fry Station', href: '/kds/fry' },
      { label: 'Salad / Cold Station', href: '/kds/salad' },
    ],
  },
  {
    title: 'Admin Portal',
    description: 'Menu, staff, floor, tax, devices, and reports for every location.',
    icon: LayoutDashboard,
    href: '/admin',
    screens: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Locations', href: '/admin/locations' },
      { label: 'Menu Builder', href: '/admin/menu' },
      { label: 'Recipes', href: '/admin/recipes' },
      { label: 'Staff & Roles', href: '/admin/staff' },
      { label: 'Reports', href: '/admin/reports' },
      { label: 'Integrations Console', href: '/admin/integrations' },
      { label: 'Onboarding Wizard', href: '/admin/onboarding' },
      { label: 'Devices & Registers', href: '/admin/devices' },
      { label: 'Floor & Tables', href: '/admin/floor' },
      { label: 'Tax & Discounts', href: '/admin/pricing' },
      { label: 'Customers', href: '/admin/customers' },
      { label: 'Receipts', href: '/admin/receipts' },
      { label: 'Backups & Monitoring', href: '/admin/reliability' },
      { label: 'Post-Launch Modules', href: '/admin/growth' },
      { label: 'Settings', href: '/admin/settings' },
      { label: 'Billing', href: '/admin/billing' },
    ],
  },
  {
    title: 'Customer Ordering',
    description: 'Guest menu, cart, checkout, order status, and QR table ordering.',
    icon: ShoppingBag,
    href: '/order',
    screens: [
      { label: 'Restaurant Landing', href: '/order' },
      { label: 'Menu Browse', href: '/order/menu' },
      { label: 'Item Detail', href: '/order/menu/mi-1' },
      { label: 'Cart Review', href: '/order/cart' },
      { label: 'Checkout', href: '/order/checkout' },
      { label: 'Order Status', href: '/order/status' },
      { label: 'QR Table Ordering', href: '/order/table/12' },
    ],
  },
]

export default function Home() {
  return (
    <div className="page-canvas flex min-h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/90 px-4 backdrop-blur-md md:h-[4.5rem] md:px-6">
        <AirestsMark size="lg" />
        <ThemeToggle />
      </header>

      <main className="w-full px-4 py-6 md:px-6 md:py-8">
        <div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Airests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Open a surface, or jump straight to a screen.</p>
        </div>

        <Stagger className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" delay={0.07}>
          {surfaces.map((surface) => (
            <StaggerItem key={surface.title} hover className="h-full">
              <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                      <surface.icon className="size-5 text-accent-foreground" />
                    </div>
                    <h2 className="font-sans text-base font-semibold tracking-tight text-foreground">{surface.title}</h2>
                  </div>
                  <Link
                    href={surface.href}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Open <ArrowRight className="size-3.5" />
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{surface.description}</p>
                <div className="mt-4 flex flex-wrap content-start gap-1.5 border-t border-border pt-4">
                  {surface.screens.map((screen) => (
                    <Link
                      key={screen.href}
                      href={screen.href}
                      className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                    >
                      {screen.label}
                    </Link>
                  ))}
                </div>
              </section>
            </StaggerItem>
          ))}
        </Stagger>
      </main>
    </div>
  )
}
