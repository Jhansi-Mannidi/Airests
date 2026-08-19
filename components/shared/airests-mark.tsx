import { cn } from '@/lib/utils'

const sizeMap = {
  sm: { badge: 'size-6', icon: 'size-3.5', text: 'text-[13px]', radius: 8, gap: 'gap-1.5' },
  md: { badge: 'size-7', icon: 'size-4', text: 'text-[15px]', radius: 9, gap: 'gap-2' },
  lg: { badge: 'size-9', icon: 'size-5', text: 'text-lg', radius: 11, gap: 'gap-2.5' },
  xl: { badge: 'size-12', icon: 'size-7', text: 'text-2xl', radius: 14, gap: 'gap-3' },
} as const

/**
 * The Airests logomark: a monogram "A" — two converging strokes with a
 * rounded crossbar evoking a place setting — on a gradient badge. Reused
 * everywhere the brand appears (topbars, sidebars, login/onboarding, the
 * favicon, and social share image) so the mark is pixel-consistent across
 * the whole product.
 */
export function AirestsMark({
  className,
  iconClassName,
  showWordmark = true,
  size = 'md',
}: {
  className?: string
  iconClassName?: string
  showWordmark?: boolean
  size?: keyof typeof sizeMap
}) {
  const s = sizeMap[size]

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <div
        className={cn('relative flex shrink-0 items-center justify-center overflow-hidden shadow-md ring-2 ring-primary/20', s.badge, iconClassName)}
        style={{
          borderRadius: s.radius,
          backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        }}
      >
        {/* subtle top-left sheen for depth */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)' }}
        />
        <svg viewBox="0 0 24 24" fill="none" className={cn(s.icon, 'relative')}>
          <path d="M7.1 19 12 5.2 16.9 19" stroke="var(--primary-foreground)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.3 13.6h5.4" stroke="var(--primary-foreground)" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      </div>
      {showWordmark && (
        <span className={cn('font-sans font-bold tracking-tight text-foreground', s.text)}>Airests</span>
      )}
    </div>
  )
}
