'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { giftCards, inventoryItems, loyalty, reservations } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const tabs = ['Loyalty', 'Gift Cards', 'Reservations', 'Inventory', 'CRM / Marketing', 'Advanced Analytics', 'Bar / Pre-auth'] as const

export default function GrowthPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Loyalty')

  return (
    <>
      <AdminTopbar title="Post-Launch Modules" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Excel marks these POST-LAUNCH. They are included here as working demos so the full sheet is covered without blocking V1.
        </p>
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium',
                tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Loyalty' && (
          <Card title={`${loyalty.memberName} · ${loyalty.tier}`}>
            <p className="font-mono text-2xl font-semibold tabular-nums">{loyalty.pointsBalance} pts</p>
            <p className="mt-1 text-sm text-muted-foreground">{loyalty.pointsToNextReward} to next $5 reward at {loyalty.rewardAt}.</p>
            <button onClick={() => toast.success('Points adjusted')} className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Adjust points
            </button>
          </Card>
        )}

        {tab === 'Gift Cards' && (
          <GiftCardsCard />
        )}

        {tab === 'Reservations' && (
          <Card title="Tonight">
            {reservations.map((r) => (
              <div key={r.time + r.name} className="flex justify-between border-b border-border/60 py-2 text-sm">
                <span>
                  {r.time} · {r.name} · {r.covers} covers
                </span>
                <span className="text-muted-foreground">{r.notes}</span>
              </div>
            ))}
          </Card>
        )}

        {tab === 'Inventory' && (
          <Card title="On-hand vs par">
            <p className="mb-3 text-sm text-muted-foreground">
              Recipes now live under Admin → Recipes. Selling a dish is meant to pull these ingredients (demo list only).
            </p>
            {inventoryItems.map((i) => (
              <div key={i.name} className="flex justify-between border-b border-border/60 py-2 text-sm">
                <span>{i.name}</span>
                <span className={i.onHand < i.par ? 'font-semibold text-danger' : 'font-mono'}>
                  {i.onHand} / {i.par} {i.unit}
                </span>
              </div>
            ))}
            <Link href="/admin/recipes" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Open recipes
            </Link>
          </Card>
        )}

        {tab === 'CRM / Marketing' && (
          <Card title="Campaigns">
            <p className="text-sm text-muted-foreground">SMS order-ready is live. Marketing audiences stay post-launch.</p>
            <button onClick={() => toast.success('Campaign drafted')} className="mt-3 rounded-md border border-border px-3 py-2 text-sm font-semibold">
              Draft win-back SMS
            </button>
          </Card>
        )}

        {tab === 'Advanced Analytics' && (
          <Card title="Beyond core X/Z">
            <p className="text-sm">Cohort LTV, channel mix, and menu engineering stay here so V1 reports stay operational.</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {['Direct 41%', '3P 22%', 'Dine-in 37%'].map((s) => (
                <div key={s} className="rounded-lg bg-muted py-3 text-sm font-semibold">
                  {s}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'Bar / Pre-auth' && (
          <Card title="Bar tabs">
            <p className="text-sm text-muted-foreground">Open tab, pre-auth hold, and close-out are specialized FSR/bar workflows.</p>
            <button onClick={() => toast.success('Pre-auth hold $80 on B4')} className="mt-3 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Open pre-auth tab
            </button>
          </Card>
        )}
      </main>
    </>
  )
}

function GiftCardsCard() {
  const [cards, setCards] = useState(() => giftCards.map((card) => ({ ...card })))
  const [query, setQuery] = useState('')
  const visible = cards.filter((card) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${card.number} ${card.status}`.toLowerCase().includes(q)
  })

  return (
    <Card title="Stored value">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards…"
        className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
      />
      <table className="w-full text-sm">
        <tbody>
          {visible.map((g) => (
            <tr key={g.number} className="border-b border-border/60">
              <td className="py-2 font-mono">{g.number}</td>
              <td className="py-2">${g.balance.toFixed(2)}</td>
              <td className="py-2">{g.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          const number = `•••• ${Math.floor(1000 + Math.random() * 9000)}`
          setCards((prev) => [{ number, balance: 50, status: 'Active' }, ...prev])
          toast.success('Gift card issued', { description: `${number} · $50` })
        }}
        className="mt-3 text-sm font-semibold text-primary"
      >
        Issue $50 card
      </button>
    </Card>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}
