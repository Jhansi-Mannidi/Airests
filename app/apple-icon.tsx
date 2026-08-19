import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// iOS home-screen icon — same monogram as the favicon, scaled up with more
// generous padding since Apple applies its own corner mask on top.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #14806F 0%, #0B5347 100%)',
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path d="M7.1 19 12 5.2 16.9 19" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.3 13.6h5.4" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
