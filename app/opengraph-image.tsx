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
          background: '#09090B',
          backgroundImage:
            'radial-gradient(circle at 82% 18%, rgba(255,122,53,0.22) 0%, rgba(255,122,53,0) 55%), radial-gradient(circle at 8% 92%, rgba(250,250,250,0.06) 0%, rgba(250,250,250,0) 50%)',
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
            background: 'linear-gradient(135deg, #FF7A35 0%, #E5651C 100%)',
            marginBottom: 40,
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <path d="M7.1 19 12 5.2 16.9 19" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.3 13.6h5.4" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#F9F9F9',
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
            color: '#B8A99A',
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
