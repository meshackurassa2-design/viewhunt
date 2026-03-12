import { LayoutDashboard, TrendingUp, Zap, BarChart3, Lightbulb, Bookmark, Settings, PlayCircle } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Home',   icon: LayoutDashboard },
  { id: 'trends',    label: 'Trends',     icon: TrendingUp },
  { id: 'scraper',   label: 'Scraper',     icon: Zap },
  { id: 'analyzer',  label: 'Audit',      icon: BarChart3  },
  { id: 'video-intel', label: 'Intel', icon: PlayCircle },
  { id: 'ideas',    label: 'AI',      icon: Lightbulb  },
]

export default function BottomNav({ currentPage, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(64px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'rgba(17, 17, 17, 0.85)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
      boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = currentPage === id
        return (
          <button 
            key={id} 
            onClick={() => onNavigate(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'transparent',
              border: 'none',
              padding: '8px 4px',
              color: active ? 'var(--white)' : 'var(--muted)',
              transition: 'all .15s',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span style={{ 
              fontSize: '10px', 
              fontWeight: active ? 800 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
