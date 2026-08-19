import { cn } from '@/lib/utils'

export function WindowFrame({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-elevated',
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-border bg-muted/60 px-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <p className="truncate text-[11px] font-medium text-muted-foreground">{title}</p>
      </div>
      {children}
    </div>
  )
}
