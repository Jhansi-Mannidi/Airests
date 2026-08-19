import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Renders the Airests logomark — a monogram "A" on a gradient badge —
// as the browser tab favicon. Kept in sync with components/shared/airests-mark.tsx.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #FF7A35 0%, #E5651C 100%)',
        }}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path d="M7.1 19 12 5.2 16.9 19" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.3 13.6h5.4" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
