'use client'

import { useState } from 'react'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Check, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = ['Business Info', 'Locations', 'Register Setup', 'Menu Import', 'Payment/Tax Config', 'Review & Launch']

const parsedItems = [
  { name: 'Classic Smash Burger', price: '$12.50', category: 'Burgers', status: 'ok' },
  { name: 'BBQ Bacon Cheeseburger', price: '$13.75', category: 'Burgers', status: 'ok' },
  { name: 'Grilled Chicken Burrito Bowl', price: '$11.95', category: 'Bowls', status: 'ok' },
  { name: 'Kids Chicken Tenders', price: '—', category: 'Kids Menu', status: 'warning' },
  { name: 'House Salad', price: '$8.50', category: 'Salads', status: 'warning' },
  { name: 'Iced Oat Milk Latte', price: '$5.25', category: 'Drinks', status: 'ok' },
]

export default function OnboardingWizardPage() {
  const [current] = useState(3)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
        <AirestsMark size="lg" />
        <ThemeToggle />
      </header>

      {/* Step indicator */}
      <div className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-initial">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    i < current && 'bg-success text-success-foreground',
                    i === current && 'bg-primary text-primary-foreground',
                    i > current && 'bg-muted text-muted-foreground',
                  )}
                >
                  {i < current ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={cn('hidden text-center text-xs font-medium sm:block', i === current ? 'text-foreground' : 'text-muted-foreground')}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('mx-2 h-px flex-1', i < current ? 'bg-success' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Step 4 of 6</p>
            <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground">Menu Import</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your existing menu as a CSV file and we&apos;ll map items, prices, and categories automatically.
            </p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-card p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent">
              <Upload className="size-6 text-accent-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Drag & drop your CSV file here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse — supports .csv up to 10MB</p>
            <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Browse Files
            </button>
          </div>

          {/* Parsed preview */}
          <div className="mt-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">riverside-menu-2026.csv</h2>
              </div>
              <span className="text-xs text-muted-foreground">6 of 48 rows shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Item Name</th>
                    <th className="px-4 py-2.5 font-medium">Price</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Category</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedItems.map((item) => (
                    <tr key={item.name} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-foreground">{item.price}</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{item.category}</td>
                      <td className="px-4 py-2.5">
                        {item.status === 'ok' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                            <CheckCircle2 className="size-3.5" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                            <AlertTriangle className="size-3.5" /> Missing price
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-t border-border p-4 text-sm">
              <CheckCircle2 className="size-4 text-success" />
              <span className="font-medium text-foreground">46 items validated</span>
              <span className="text-muted-foreground">·</span>
              <AlertTriangle className="size-4 text-warning" />
              <span className="font-medium text-foreground">2 warnings need review</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
              Back
            </button>
            <button className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
