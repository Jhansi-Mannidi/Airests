'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { Check, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { headerIndex, parseCsv } from '@/lib/export'

const steps = ['Business Info', 'Locations', 'Register Setup', 'Menu Import', 'Payment/Tax Config', 'Review & Launch']

type ParsedRow = { name: string; price: string; category: string; status: 'ok' | 'warning' }

export default function OnboardingWizardPage() {
  const [current, setCurrent] = useState(3)
  const [businessName, setBusinessName] = useState('Riverside Hospitality Group')
  const [locationCount, setLocationCount] = useState('5')
  const [taxRate, setTaxRate] = useState('8.25')
  const [fileName, setFileName] = useState('riverside-menu-2026.csv')
  const [parsedItems, setParsedItems] = useState<ParsedRow[]>([
    { name: 'Classic Smash Burger', price: '$12.50', category: 'Burgers', status: 'ok' },
    { name: 'BBQ Bacon Cheeseburger', price: '$13.75', category: 'Burgers', status: 'ok' },
    { name: 'Grilled Chicken Burrito Bowl', price: '$11.95', category: 'Bowls', status: 'ok' },
    { name: 'Kids Chicken Tenders', price: '—', category: 'Kids Menu', status: 'warning' },
    { name: 'House Salad', price: '$8.50', category: 'Salads', status: 'warning' },
    { name: 'Iced Oat Milk Latte', price: '$5.25', category: 'Drinks', status: 'ok' },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const warnings = parsedItems.filter((item) => item.status === 'warning').length
  const valid = parsedItems.filter((item) => item.status === 'ok').length

  function readFile(file: File) {
    void file.text().then((text) => {
      const rows = parseCsv(text)
      if (!rows.length) {
        toast.error('That CSV is empty')
        return
      }
      const header = rows[0]
      const nameIdx = Math.max(headerIndex(header, 'name', 'item'), 0)
      const priceIdx = headerIndex(header, 'price')
      const catIdx = headerIndex(header, 'cat')
      const hasHeader = headerIndex(header, 'name', 'item', 'price') >= 0
      const body = hasHeader ? rows.slice(1) : rows
      const next: ParsedRow[] = body
        .map((row) => {
          const name = row[nameIdx]?.trim()
          if (!name) return null
          const priceRaw = (priceIdx >= 0 ? row[priceIdx] : row[1]) ?? ''
          const priceNum = Number.parseFloat(priceRaw.replace(/[^0-9.]/g, ''))
          const category = (catIdx >= 0 ? row[catIdx] : row[2])?.trim() || 'Uncategorized'
          return {
            name,
            price: Number.isNaN(priceNum) ? '—' : `$${priceNum.toFixed(2)}`,
            category,
            status: Number.isNaN(priceNum) ? 'warning' : 'ok',
          } satisfies ParsedRow
        })
        .filter((row): row is ParsedRow => Boolean(row))
      setFileName(file.name)
      setParsedItems(next)
      toast.success(`Parsed ${next.length} rows`)
    })
  }

  function back() {
    setCurrent((step) => Math.max(0, step - 1))
  }

  function continueStep() {
    if (current === steps.length - 1) {
      toast.success('Launch checklist complete', { description: 'Demo only — open Admin to keep exploring.' })
      return
    }
    setCurrent((step) => step + 1)
  }

  return (
    <div className="flex min-h-dvh flex-col page-canvas">
      <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
        <AirestsMark size="lg" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AppSwitcher />
        </div>
      </header>

      <div className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between overflow-x-auto">
          {steps.map((step, i) => (
            <button key={step} type="button" onClick={() => setCurrent(i)} className="flex flex-1 items-center last:flex-initial">
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
              {i < steps.length - 1 && <div className={cn('mx-2 h-px flex-1', i < current ? 'bg-success' : 'bg-border')} />}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">
              Step {current + 1} of {steps.length}
            </p>
            <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground">{steps[current]}</h1>
          </div>

          {current === 0 && (
            <label className="block text-sm font-medium text-foreground">
              Business name
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}

          {current === 1 && (
            <label className="block text-sm font-medium text-foreground">
              How many locations are you launching?
              <input
                value={locationCount}
                onChange={(e) => setLocationCount(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}

          {current === 2 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Pair the first Windows POS with code RG-1943. Expires in 10 minutes.</p>
              <button
                onClick={() => toast.success('Pairing code created', { description: 'RG-1943' })}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Generate pairing code
              </button>
            </div>
          )}

          {current === 3 && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Upload your existing menu as a CSV file and we&apos;ll map items, prices, and categories automatically.
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) readFile(file)
                }}
              />
              <div className="rounded-xl border-2 border-dashed border-border bg-card p-8 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent">
                  <Upload className="size-6 text-accent-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Drag & drop your CSV file here</p>
                <p className="mt-1 text-xs text-muted-foreground">or click to browse — supports .csv up to 10MB</p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Browse Files
                </button>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{fileName}</h2>
                  </div>
                  <span className="text-xs text-muted-foreground">{Math.min(parsedItems.length, 8)} of {parsedItems.length} rows shown</span>
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
                      {parsedItems.slice(0, 8).map((item) => (
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
                  <span className="font-medium text-foreground">{valid} items validated</span>
                  <span className="text-muted-foreground">·</span>
                  <AlertTriangle className="size-4 text-warning" />
                  <span className="font-medium text-foreground">{warnings} warnings need review</span>
                </div>
              </div>
            </>
          )}

          {current === 4 && (
            <label className="block text-sm font-medium text-foreground">
              Combined tax rate (%)
              <input
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}

          {current === 5 && (
            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <p>
                <span className="font-semibold">{businessName}</span> · {locationCount} locations · {taxRate}% tax · {parsedItems.length} menu rows
              </p>
              <p className="mt-2 text-muted-foreground">This is a clickable demo. Launch does not create a live tenant.</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={back}
              disabled={current === 0}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-40"
            >
              Back
            </button>
            {current === steps.length - 1 ? (
              <Link href="/admin" className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Open Admin
              </Link>
            ) : (
              <button onClick={continueStep} className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Continue
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
