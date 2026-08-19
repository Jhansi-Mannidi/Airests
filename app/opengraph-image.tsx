import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          background: '#0B1220',
          backgroundImage:
            'radial-gradient(circle at 82% 18%, rgba(45,212,191,0.22) 0%, rgba(45,212,191,0) 55%), radial-gradient(circle at 8% 92%, rgba(45,212,191,0.14) 0%, rgba(45,212,191,0) 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 88,
            height: 88,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #2DD4BF 0%, #0F6B5C 100%)',
            marginBottom: 40,
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <path d="M7.1 19 12 5.2 16.9 19" stroke="#06231D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.3 13.6h5.4" stroke="#06231D" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#F1F5F9',
          }}
        >
          Airests
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 30,
            fontWeight: 500,
            color: '#94A3B8',
            maxWidth: 820,
          }}
        >
          The complete restaurant operations platform — POS, Kitchen Display, Admin Portal, and Online Ordering.
        </div>
      </div>
    ),
    { ...size },
  )
}
