'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { Calendar, Download, Search } from 'lucide-react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { Pressable, Stagger, StaggerItem } from '@/components/motion/primitives'
import { brand } from '@/lib/mock-data'
import { downloadCsvSections, fileStamp, money, printReport } from '@/lib/export'
import { cn } from '@/lib/utils'

const reportTabs = [
  'Daily Sales',
  'Tax Summary',
  'Tips',
  'Voids & Refunds',
  'Server Performance',
  'X Report',
  'Z Report',
  'Terminal Reconciliation',
] as const

type ReportTab = (typeof reportTabs)[number]
type DateRange = 'Today' | 'Yesterday' | 'Last 7 Days'

const rangeFactor: Record<DateRange, number> = {
  Today: 1,
  Yesterday: 0.86,
  'Last 7 Days': 6.4,
}

const rangeFullLabel: Record<DateRange, string> = {
  Today: 'Today — Aug 19, 2026',
  Yesterday: 'Yesterday — Aug 18, 2026',
  'Last 7 Days': 'Aug 13 – Aug 19, 2026',
}

/** Locked to the Reports mockup for Today, then scaled for other ranges. */
const dailySalesSeed = [
  { name: 'Maria Alvarez', orders: 42, sales: 2480.5, tips: 412.5, voids: 0 },
  { name: 'Jordan Pierce', orders: 38, sales: 2195.2, tips: 365.8, voids: 2 },
  { name: 'Devon Shaw', orders: 31, sales: 1688.4, tips: 288.2, voids: 0 },
  { name: 'Chloe Dawson', orders: 36, sales: 1920.15, tips: 310.15, voids: 1 },
  { name: 'Ryan Ostrowski', orders: 28, sales: 1344.8, tips: 198.4, voids: 1 },
  { name: 'Nina Osei', orders: 33, sales: 1566.25, tips: 246.8, voids: 0 },
  { name: 'Aisha Brooks', orders: 22, sales: 980.4, tips: 142.1, voids: 1 },
  { name: 'Tomas Reyes', orders: 24, sales: 890.14, tips: 155.08, voids: 0 },
  { name: 'Leah Fontaine', orders: 19, sales: 696.2, tips: 113.1, voids: 0 },
]

const recentTransactions = [
  { id: '#4479', time: '12:11 PM', server: 'Nina Osei', type: 'Takeout', total: 18.5, tender: 'Card' },
  { id: '#4478', time: '12:09 PM', server: 'Devon Shaw', type: 'Bar Tab', total: 33.0, tender: 'Card' },
  { id: '#4477', time: '12:04 PM', server: 'Maria Alvarez', type: 'Dine-In', total: 148.75, tender: 'Split' },
  { id: '#4476', time: '11:58 AM', server: 'Chloe Dawson', type: 'Dine-In', total: 41.2, tender: 'Card' },
  { id: '#4475', time: '11:49 AM', server: 'Jordan Pierce', type: 'Delivery', total: 27.4, tender: 'Online' },
  { id: '#4474', time: '11:47 AM', server: 'Chloe Dawson', type: 'Takeout', total: 27.5, tender: 'Cash' },
  { id: '#4473', time: '11:41 AM', server: 'Maria Alvarez', type: 'Dine-In', total: 212.4, tender: 'Card' },
  { id: '#4472', time: '11:36 AM', server: 'Ryan Ostrowski', type: 'Bar Tab', total: 46.0, tender: 'Card' },
  { id: '#4471', time: '11:28 AM', server: 'Aisha Brooks', type: 'Takeout', total: 22.15, tender: 'Cash' },
]

const taxSeed = brand.locations.map((loc, index) => {
  const taxable = Math.round(loc.salesToday * 0.94 * 100) / 100
  const exempt = Math.round((loc.salesToday - taxable) * 100) / 100
  const tax = Math.round(taxable * 0.0825 * 100) / 100
  return {
    location: loc.name.replace('Riverside Grill — ', ''),
    taxable,
    exempt,
    tax,
    rate: index === 4 ? '8.00%' : '8.25%',
  }
})

const xReportSeed = [
  { terminal: 'Register 1', tenders: 86, cash: 214.5, card: 1840.2, tips: 312.4, variance: 0 },
  { terminal: 'Register 2', tenders: 112, cash: 188.0, card: 2410.75, tips: 418.9, variance: 0 },
  { terminal: 'Online / 3P', tenders: 41, cash: 0, card: 980.4, tips: 44.2, variance: 0 },
]

const zReportSeed = [
  { bucket: 'Food', net: 9840.22, tax: 811.82, tips: 0 },
  { bucket: 'Beverage', net: 2210.4, tax: 182.36, tips: 0 },
  { bucket: 'Alcohol', net: 576.05, tax: 47.52, tips: 0 },
  { bucket: 'Tips (declared)', net: 0, tax: 0, tips: 2232.13 },
]

const terminalSeed = [
  { batch: '#4418', terminal: 'Register 1 · Downtown', auth: 2054.7, captured: 2054.7, tips: 312.4, variance: 0 },
  { batch: '#4419', terminal: 'Register 2 · Downtown', auth: 2829.65, captured: 2829.65, tips: 418.9, variance: 0 },
  { batch: '#4420', terminal: 'Online hosted fields', auth: 980.4, captured: 968.15, tips: 44.2, variance: -12.25 },
]

function scale(n: number, factor: number) {
  return Math.round(n * factor * 100) / 100
}

function matchesQuery(haystack: string, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return haystack.toLowerCase().includes(q)
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('Daily Sales')
  const [range, setRange] = useState<DateRange>('Today')
  const [query, setQuery] = useState('')
  const factor = rangeFactor[range]
  const period = rangeFullLabel[range]

  const salesRows = useMemo(
    () =>
      dailySalesSeed.map((row) => {
        const orders = Math.round(row.orders * factor)
        const sales = scale(row.sales, factor)
        const tips = scale(row.tips, factor)
        const voids = Math.round(row.voids * (range === 'Last 7 Days' ? 3 : 1))
        return {
          ...row,
          orders,
          sales,
          tips,
          voids,
          avgCheck: orders === 0 ? 0 : Math.round((sales / orders) * 100) / 100,
        }
      }),
    [factor, range],
  )

  const visibleSales = salesRows
    .filter((row) => {
      if (activeTab === 'Voids & Refunds' && row.voids === 0) return false
      return matchesQuery(row.name, query)
    })
    .slice()
    .sort((a, b) => {
      if (activeTab === 'Tips' || activeTab === 'Server Performance') return b.tips - a.tips
      return 0
    })

  const gross = visibleSales.reduce((sum, row) => sum + row.sales, 0)
  const tipsTotal = visibleSales.reduce((sum, row) => sum + row.tips, 0)
  const voidCount = visibleSales.reduce((sum, row) => sum + row.voids, 0)
  const allVoidCount = salesRows.reduce((sum, row) => sum + row.voids, 0)
  const voidAmount = allVoidCount === 0 ? 0 : scale(92.5, factor) * (voidCount / allVoidCount)
  const tax = Math.round(gross * 0.0825 * 100) / 100
  const net = Math.round((gross - tax) * 100) / 100
  const orders = visibleSales.reduce((sum, row) => sum + row.orders, 0)

  const taxRows = taxSeed
    .map((row) => ({
      ...row,
      taxable: scale(row.taxable, factor),
      exempt: scale(row.exempt, factor),
      tax: scale(row.tax, factor),
    }))
    .filter((row) => matchesQuery(row.location, query))

  const xRows = xReportSeed
    .map((row) => ({
      ...row,
      tenders: Math.round(row.tenders * factor),
      cash: scale(row.cash, factor),
      card: scale(row.card, factor),
      tips: scale(row.tips, factor),
    }))
    .filter((row) => matchesQuery(row.terminal, query))

  const zRows = zReportSeed
    .map((row) => ({
      ...row,
      net: scale(row.net, factor),
      tax: scale(row.tax, factor),
      tips: scale(row.tips, factor),
    }))
    .filter((row) => matchesQuery(row.bucket, query))

  const terminalRows = terminalSeed
    .map((row) => ({
      ...row,
      auth: scale(row.auth, factor),
      captured: scale(row.captured, factor),
      tips: scale(row.tips, factor),
      variance: scale(row.variance, factor),
    }))
    .filter((row) => matchesQuery(`${row.batch} ${row.terminal}`, query))

  const transactions = recentTransactions.filter((t) => {
    if (!matchesQuery(`${t.id} ${t.server} ${t.type} ${t.tender}`, query)) return false
    if (activeTab === 'Voids & Refunds') return t.tender === 'Split' || t.type === 'Delivery'
    if (activeTab === 'Tips') return t.type === 'Dine-In' || t.type === 'Bar Tab'
    return true
  })

  const kpis = (() => {
    if (activeTab === 'Tax Summary') {
      const collected = taxRows.reduce((s, r) => s + r.tax, 0)
      const taxable = taxRows.reduce((s, r) => s + r.taxable, 0)
      return [
        { label: 'Taxable Sales', value: money(taxable) },
        { label: 'Tax Collected', value: money(collected) },
        { label: 'Exempt Sales', value: money(taxRows.reduce((s, r) => s + r.exempt, 0)) },
        { label: 'Rate', value: '8.25%' },
        { label: 'Locations', value: String(taxRows.length) },
      ]
    }
    if (activeTab === 'Tips') {
      return [
        { label: 'Tips', value: money(tipsTotal) },
        { label: 'Tip % of Sales', value: `${((tipsTotal / Math.max(gross, 1)) * 100).toFixed(1)}%` },
        { label: 'Servers', value: String(visibleSales.length) },
        { label: 'Avg Tip / Server', value: money(tipsTotal / Math.max(visibleSales.length, 1)) },
        { label: 'Cash Tips', value: money(tipsTotal * 0.22) },
      ]
    }
    if (activeTab === 'Voids & Refunds') {
      return [
        { label: 'Void Count', value: String(voidCount) },
        { label: 'Void Amount', value: money(voidAmount) },
        { label: 'Refunds', value: money(scale(96.4, factor)) },
        { label: 'Comps', value: money(scale(42, factor)) },
        { label: 'Void Rate', value: `${((voidCount / Math.max(orders, 1)) * 100).toFixed(1)}%` },
      ]
    }
    if (activeTab === 'X Report') {
      return [
        { label: 'Open Tenders', value: String(xRows.reduce((s, r) => s + r.tenders, 0)) },
        { label: 'Cash in Drawer', value: money(xRows.reduce((s, r) => s + r.cash, 0)) },
        { label: 'Card Captured', value: money(xRows.reduce((s, r) => s + r.card, 0)) },
        { label: 'Tips', value: money(xRows.reduce((s, r) => s + r.tips, 0)) },
        { label: 'Variance', value: money(0) },
      ]
    }
    if (activeTab === 'Z Report') {
      return [
        { label: 'Net Sales', value: money(zRows.reduce((s, r) => s + r.net, 0)) },
        { label: 'Tax', value: money(zRows.reduce((s, r) => s + r.tax, 0)) },
        { label: 'Tips', value: money(zRows.reduce((s, r) => s + r.tips, 0)) },
        { label: 'Day Close', value: 'Ready' },
        { label: 'Printed', value: 'No' },
      ]
    }
    if (activeTab === 'Terminal Reconciliation') {
      const variance = terminalRows.reduce((s, r) => s + r.variance, 0)
      return [
        { label: 'Batches', value: String(terminalRows.length) },
        { label: 'Auth', value: money(terminalRows.reduce((s, r) => s + r.auth, 0)) },
        { label: 'Captured', value: money(terminalRows.reduce((s, r) => s + r.captured, 0)) },
        { label: 'Tips', value: money(terminalRows.reduce((s, r) => s + r.tips, 0)) },
        { label: 'Variance', value: money(variance) },
      ]
    }
    return [
      { label: 'Gross Sales', value: money(gross) },
      { label: 'Net Sales', value: money(net) },
      { label: 'Tax Collected', value: money(tax) },
      { label: 'Tips', value: money(tipsTotal) },
      { label: 'Voids', value: money(voidAmount) },
    ]
  })()

  const exportSections = (() => {
    const summary = {
      heading: 'Summary',
      headers: ['Metric', 'Value'],
      rows: kpis.map((kpi) => [kpi.label, kpi.value]),
    }
    if (activeTab === 'Tax Summary') {
      return [
        summary,
        {
          heading: 'Tax by location',
          headers: ['Location', 'Taxable', 'Exempt', 'Tax', 'Rate'],
          rows: taxRows.map((row) => [row.location, money(row.taxable), money(row.exempt), money(row.tax), row.rate]),
        },
      ]
    }
    if (activeTab === 'X Report') {
      return [
        summary,
        {
          heading: 'Mid-shift snapshot',
          headers: ['Terminal', 'Tenders', 'Cash', 'Card', 'Tips', 'Variance'],
          rows: xRows.map((row) => [row.terminal, row.tenders, money(row.cash), money(row.card), money(row.tips), money(row.variance)]),
        },
      ]
    }
    if (activeTab === 'Z Report') {
      return [
        summary,
        {
          heading: 'End-of-day close',
          headers: ['Bucket', 'Net', 'Tax', 'Tips'],
          rows: zRows.map((row) => [row.bucket, money(row.net), money(row.tax), money(row.tips)]),
        },
      ]
    }
    if (activeTab === 'Terminal Reconciliation') {
      return [
        summary,
        {
          heading: 'Batches',
          headers: ['Batch', 'Terminal', 'Auth', 'Captured', 'Tips', 'Variance'],
          rows: terminalRows.map((row) => [row.batch, row.terminal, money(row.auth), money(row.captured), money(row.tips), money(row.variance)]),
        },
      ]
    }
    return [
      summary,
      {
        heading: activeTab,
        headers: ['Server', 'Orders', 'Sales', 'Tips', 'Avg Check', 'Voids'],
        rows: visibleSales.map((row) => [row.name, row.orders, money(row.sales), money(row.tips), money(row.avgCheck), row.voids]),
      },
      {
        heading: 'Recent transactions',
        headers: ['Order', 'Time', 'Server', 'Type', 'Tender', 'Total'],
        rows: transactions.map((t) => [t.id, t.time, t.server, t.type, t.tender, money(t.total)]),
      },
    ]
  })()

  function handleCsv() {
    downloadCsvSections(`airests-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${fileStamp()}`, exportSections)
  }

  function handlePdf() {
    printReport(`${activeTab} — ${period}`, exportSections, 'Riverside Hospitality Group · Downtown')
  }

  return (
    <>
      <AdminTopbar title="Reports" />
      <main className="flex-1 overflow-y-auto p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-6">
        <div className="w-full space-y-4 md:space-y-5">
          <LayoutGroup id="report-tabs">
            <div className="-mx-4 flex gap-0.5 overflow-x-auto border-b border-border px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {reportTabs.map((tab) => {
                const active = tab === activeTab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab)
                      setQuery('')
                    }}
                    className={cn(
                      'relative h-11 shrink-0 px-3 text-sm font-medium transition-colors',
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab}
                    {active && (
                      <m.span
                        layoutId="report-tab-underline"
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(['Today', 'Yesterday', 'Last 7 Days'] as const).map((option) => {
                const active = range === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRange(option)}
                    className={cn(
                      'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground shadow-[0_6px_16px_rgba(255,122,53,0.28)]'
                        : 'border-border bg-card text-foreground hover:bg-secondary',
                    )}
                  >
                    <Calendar className={cn('size-4', active ? 'text-primary-foreground' : 'text-muted-foreground')} />
                    <span className="sm:hidden">{option}</span>
                    <span className="hidden sm:inline">{active ? rangeFullLabel[option] : option}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter this report…"
                  className="h-10 w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Pressable
                  onClick={handleCsv}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Download className="size-4" />
                  CSV
                </Pressable>
                <Pressable
                  onClick={handlePdf}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Download className="size-4" />
                  PDF
                </Pressable>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <m.div
              key={`${activeTab}-${range}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5" delay={0.04}>
                {kpis.map((kpi) => (
                  <StaggerItem key={kpi.label}>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-surface">
                      <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                      <p className="mt-2 font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-foreground md:text-2xl">
                        {kpi.value}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {activeTab === 'Tax Summary' ? (
                <ReportTable
                  title="Tax Summary"
                  subtitle={period}
                  headers={['Location', 'Taxable', 'Exempt', 'Tax', 'Rate']}
                  rows={taxRows.map((row) => [row.location, money(row.taxable), money(row.exempt), money(row.tax), row.rate])}
                  empty="No locations match this filter."
                  totals={['Total', money(taxRows.reduce((s, r) => s + r.taxable, 0)), money(taxRows.reduce((s, r) => s + r.exempt, 0)), money(taxRows.reduce((s, r) => s + r.tax, 0)), '']}
                />
              ) : activeTab === 'X Report' ? (
                <ReportTable
                  title="X Report"
                  subtitle={period}
                  headers={['Terminal', 'Tenders', 'Cash', 'Card', 'Tips', 'Variance']}
                  rows={xRows.map((row) => [row.terminal, row.tenders, money(row.cash), money(row.card), money(row.tips), money(row.variance)])}
                  empty="No terminals match this filter."
                  totals={[
                    'Total',
                    xRows.reduce((s, r) => s + r.tenders, 0),
                    money(xRows.reduce((s, r) => s + r.cash, 0)),
                    money(xRows.reduce((s, r) => s + r.card, 0)),
                    money(xRows.reduce((s, r) => s + r.tips, 0)),
                    money(0),
                  ]}
                />
              ) : activeTab === 'Z Report' ? (
                <ReportTable
                  title="Z Report"
                  subtitle={period}
                  headers={['Sales bucket', 'Net', 'Tax', 'Tips']}
                  rows={zRows.map((row) => [row.bucket, money(row.net), money(row.tax), money(row.tips)])}
                  empty="No Z-close lines match this filter."
                  totals={[
                    'Day total',
                    money(zRows.reduce((s, r) => s + r.net, 0)),
                    money(zRows.reduce((s, r) => s + r.tax, 0)),
                    money(zRows.reduce((s, r) => s + r.tips, 0)),
                  ]}
                />
              ) : activeTab === 'Terminal Reconciliation' ? (
                <ReportTable
                  title="Terminal Reconciliation"
                  subtitle={period}
                  headers={['Batch', 'Terminal', 'Auth', 'Captured', 'Tips', 'Variance']}
                  rows={terminalRows.map((row) => [
                    row.batch,
                    row.terminal,
                    money(row.auth),
                    money(row.captured),
                    money(row.tips),
                    row.variance === 0 ? money(0) : money(row.variance),
                  ])}
                  empty="No batches match this filter."
                  emphasisLast
                />
              ) : (
                <>
                  <ReportTable
                    title={activeTab}
                    subtitle={period}
                    headers={['Server', 'Orders', 'Sales', 'Tips', 'Avg. Check', 'Voids']}
                    rows={visibleSales.map((row) => [
                      row.name,
                      row.orders,
                      money(row.sales),
                      money(row.tips),
                      money(row.avgCheck),
                      row.voids,
                    ])}
                    empty="No servers match this filter."
                    totals={[
                      'Total',
                      orders,
                      money(gross),
                      money(tipsTotal),
                      '—',
                      voidCount,
                    ]}
                    dangerLast
                  />
                  <ReportTable
                    title="Recent Transactions"
                    subtitle="Live feed of the most recent closed checks"
                    headers={['Order', 'Time', 'Server', 'Type', 'Tender', 'Total']}
                    rows={transactions.map((t) => [t.id, t.time, t.server, t.type, t.tender, money(t.total)])}
                    empty="No transactions match this filter."
                    highlightLast
                  />
                </>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}

function cellTone({
  value,
  last,
  dangerLast,
  emphasisLast,
}: {
  value: string | number
  last: boolean
  dangerLast?: boolean
  emphasisLast?: boolean
}) {
  const isVoid = dangerLast && last && Number(value) > 0
  const isZeroVoid = dangerLast && last && Number(value) === 0
  const isVariance = emphasisLast && last && String(value).includes('-')
  return cn(isVoid && 'text-danger', isZeroVoid && 'text-muted-foreground', isVariance && 'text-danger')
}

function MetricGrid({
  headers,
  values,
  dangerLast,
  emphasisLast,
}: {
  headers: string[]
  values: (string | number)[]
  dangerLast?: boolean
  emphasisLast?: boolean
}) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
      {headers.map((header, index) => {
        const last = index === values.length - 1
        return (
          <div key={header} className="min-w-0">
            <dt className="text-[11px] font-medium text-muted-foreground">{header}</dt>
            <dd
              className={cn(
                'mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground',
                cellTone({ value: values[index], last, dangerLast, emphasisLast }),
              )}
            >
              {values[index]}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function ReportTable({
  title,
  subtitle,
  headers,
  rows,
  totals,
  empty,
  dangerLast,
  emphasisLast,
  highlightLast,
}: {
  title: string
  subtitle?: string
  headers: string[]
  rows: (string | number)[][]
  totals?: (string | number)[]
  empty: string
  dangerLast?: boolean
  emphasisLast?: boolean
  highlightLast?: boolean
}) {
  const metricHeaders = headers.slice(1)
  const highlight = highlightLast || headers[headers.length - 1] === 'Total'

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-surface">
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <>
          <ul className="divide-y divide-border md:hidden">
            {rows.map((row, rowIndex) => {
              const metrics = highlight ? row.slice(1, -1) : row.slice(1)
              const metricLabels = highlight ? metricHeaders.slice(0, -1) : metricHeaders
              const last = row[row.length - 1]
              return (
                <li key={`${row[0]}-${rowIndex}`} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-snug text-foreground">{row[0]}</p>
                    {highlight && (
                      <p
                        className={cn(
                          'shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground',
                          cellTone({ value: last, last: true, dangerLast, emphasisLast }),
                        )}
                      >
                        {last}
                      </p>
                    )}
                  </div>
                  {metricLabels.length > 0 && (
                    <MetricGrid
                      headers={metricLabels}
                      values={metrics}
                      dangerLast={highlight ? undefined : dangerLast}
                      emphasisLast={highlight ? undefined : emphasisLast}
                    />
                  )}
                </li>
              )
            })}
            {totals && (
              <li className="bg-muted/40 px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{totals[0]}</p>
                  {highlight && (
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{totals[totals.length - 1]}</p>
                  )}
                </div>
                <MetricGrid
                  headers={highlight ? metricHeaders.slice(0, -1) : metricHeaders}
                  values={highlight ? totals.slice(1, -1) : totals.slice(1)}
                />
              </li>
            )}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={cn('whitespace-nowrap px-5 py-2.5 font-medium', index === 0 ? 'text-left' : 'text-right')}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                    {row.map((cell, index) => {
                      const last = index === row.length - 1
                      return (
                        <td
                          key={`${headers[index]}-${index}`}
                          className={cn(
                            'whitespace-nowrap px-5 py-2.5',
                            index === 0 ? 'font-medium text-foreground' : 'text-right font-mono tabular-nums text-foreground',
                            cellTone({ value: cell, last, dangerLast, emphasisLast }),
                          )}
                        >
                          {cell}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
              {totals && (
                <tfoot>
                  <tr className="border-t border-border bg-muted/40 font-medium text-foreground">
                    {totals.map((cell, index) => (
                      <td
                        key={`total-${index}`}
                        className={cn(
                          'whitespace-nowrap px-5 py-2.5',
                          index === 0 ? 'text-left' : 'text-right font-mono tabular-nums',
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </>
      )}
    </section>
  )
}
