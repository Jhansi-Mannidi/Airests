import { cn } from '@/lib/utils'
import { Wifi, WifiOff, RefreshCw, Circle } from 'lucide-react'

type Tone = 'neutral' | 'info' | 'warning' | 'danger' | 'success'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-info/15 text-info dark:text-info',
  warning: 'bg-warning/15 text-warning dark:text-warning',
  danger: 'bg-danger/15 text-danger dark:text-danger',
  success: 'bg-success/15 text-success dark:text-success',
}

export function StatusPill({
  tone = 'neutral',
  children,
  className,
  dot = false,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span className={cn('status-pill', toneClasses[tone], className)}>
      {dot && <Circle className="size-2 fill-current" strokeWidth={0} />}
      {children}
    </span>
  )
}

export function ConnectivityChip({
  state,
  pendingCount,
  className,
}: {
  state: 'online' | 'offline' | 'syncing'
  pendingCount?: number
  className?: string
}) {
  if (state === 'online') {
    return (
      <StatusPill tone="success" className={className}>
        <Wifi className="size-3.5" />
        Online
      </StatusPill>
    )
  }
  if (state === 'syncing') {
    return (
      <StatusPill tone="warning" className={className}>
        <RefreshCw className="size-3.5 animate-spin" />
        Offline — Syncing
      </StatusPill>
    )
  }
  return (
    <StatusPill tone="warning" className={className}>
      <WifiOff className="size-3.5" />
      Offline{pendingCount ? ` · ${pendingCount} pending` : ''}
    </StatusPill>
  )
}

const tableStatusMeta: Record<string, { label: string; tone: Tone }> = {
  open: { label: 'Open', tone: 'neutral' },
  seated: { label: 'Seated', tone: 'info' },
  'check-printed': { label: 'Check Printed', tone: 'warning' },
  'needs-bussing': { label: 'Needs Bussing', tone: 'danger' },
}

export function TableStatusPill({ status, className }: { status: string; className?: string }) {
  const meta = tableStatusMeta[status] ?? tableStatusMeta.open
  return (
    <StatusPill tone={meta.tone} dot className={className}>
      {meta.label}
    </StatusPill>
  )
}

export function TicketAgePill({ minutes }: { minutes: number }) {
  const tone: Tone = minutes > 10 ? 'danger' : minutes >= 5 ? 'warning' : 'success'
  return (
    <StatusPill tone={tone} className="font-mono tabular-nums text-[13px]">
      {minutes}:00
    </StatusPill>
  )
}
