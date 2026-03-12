import { useEffect, useState } from 'react'

export default function AnimatedSplash({ onFinish }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Stage 1: Fade in ViewHunt
    const t1 = setTimeout(() => setStage(1), 500)
    // Stage 2: Fade in Pro
    const t2 = setTimeout(() => setStage(2), 1100)
    // Stage 3: Fade out everything
    const t3 = setTimeout(() => setStage(3), 2500)
    // Finish
    const t4 = setTimeout(() => onFinish(), 3000)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    }
  }, [onFinish])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.5s ease',
      opacity: stage === 3 ? 0 : 1,
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: '#fff',
          margin: 0,
          opacity: stage >= 1 ? 1 : 0,
          transform: `translateY(${stage >= 1 ? 0 : 20}px)`,
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          ViewHunt <span style={{
            color: '#fff',
            opacity: stage >= 2 ? 1 : 0,
            transition: 'opacity 0.5s ease',
            marginLeft: '-4px'
          }}>PRO</span>
        </h1>
        
        {/* Animated bar underline */}
        <div style={{
          height: stage >= 1 ? '4px' : '0',
          width: stage >= 1 ? '100%' : '0',
          background: '#fff',
          marginTop: '8px',
          transition: 'all 0.8s ease',
          transformOrigin: 'left'
        }} />
      </div>

      <div style={{
        marginTop: '20px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#444',
        opacity: stage >= 2 ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s'
      }}>
        Intelligence for Creators
      </div>

      {/* Subtle scanning line effect */}
      <div className="scanning-line" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #333, transparent)',
        animation: 'scan 2s linear infinite',
        opacity: 0.3
      }} />

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}
