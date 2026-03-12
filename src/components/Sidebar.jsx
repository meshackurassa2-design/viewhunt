import { useState } from 'react'
import {
  LayoutDashboard, TrendingUp, Zap, BarChart3, Lightbulb, Bookmark, BookText,
  Settings, LogOut, Crown, Clock, ChevronLeft, ChevronRight, Menu, X, Youtube, ShieldCheck, PlayCircle
} from 'lucide-react'
import { mockAuth } from '../lib/auth'

const NAV = [
  { id: 'dashboard', label: 'Market Overview',   icon: LayoutDashboard },
  { id: 'trends',    label: 'Market Trends',     icon: TrendingUp },
  { id: 'scraper',   label: 'Viral Scraper',     icon: Zap },
  { id: 'analyzer', label: 'Channel Audit',      icon: BarChart3  },
  { id: 'video-intel', label: 'Video Intelligence', icon: PlayCircle },
  { id: 'ideas',    label: 'AI Strategist',      icon: Lightbulb  },
  { id: 'notepad',   label: 'Idea Notepad',      icon: Bookmark   },
  { id: 'guide',     label: 'User Guide',        icon: BookText   },
  { id: 'settings', label: 'Settings',           icon: Settings   },
]

function fmtTime(ms) {
  const t = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

export default function Sidebar({ user, currentPage, onNavigate, trialStatus, onSignOut }) {
  const [collapsed, setCollapsed] = useState(false)
  const isPro = user?.is_pro || user?.is_admin

  const inner = (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: 'var(--white)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Youtube size={16} color="var(--black)" />
        </div>
        {!collapsed && <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--white)', letterSpacing: '-0.2px' }}>ViewHunt Pro</span>}
      </div>

      {/* Status badge (DEV BYPASS) */}
      {!collapsed && (
        <div style={{ padding: '12px 12px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 7,
            background: 'var(--white)', color: 'var(--black)',
          }}>
            <Crown size={12} />
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>Dev Unlocked</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id
          return (
            <button key={id} onClick={() => { onNavigate(id); setOpen(false) }}
              title={collapsed ? label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px' : '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? 'var(--white)' : 'transparent',
                color: active ? 'var(--black)' : 'var(--muted)',
                fontSize: 13, fontWeight: active ? 700 : 500,
                transition: 'all .15s', justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--dark2)'; e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? 'var(--black)' : 'var(--muted)' }}
            >
              <Icon size={16} />
              {!collapsed && label}
            </button>
          )
        })}

        {/* Admin Link */}
        {user?.email === 'meshackurassa2@gmail.com' && (
          <button onClick={() => { onNavigate('admin'); setOpen(false) }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: currentPage === 'admin' ? '#ff4444' : 'transparent',
              color: currentPage === 'admin' ? 'white' : '#ff4444',
              fontSize: 13, fontWeight: 700,
              transition: 'all .15s', justifyContent: collapsed ? 'center' : 'flex-start',
              marginTop: 10, border: '1px solid rgba(255,68,68,0.2)'
            }}
          >
            <ShieldCheck size={16} />
            {!collapsed && 'Admin Panel'}
          </button>
        )}
      </nav>

      {/* User + signout */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '10px 8px' }}>
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', marginBottom: 4, borderRadius: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--dark2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'var(--white)', flexShrink: 0,
            }}>
              {(user?.display_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.display_name || 'User'}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={() => { mockAuth.signOut(); onSignOut() }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '10px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--dark2)'; e.currentTarget.style.color = 'var(--white)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
        >
          <LogOut size={15} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)}
        style={{
          margin: '8px', borderRadius: 7, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
          padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  )

  const sidebarStyle = {
    height: '100%', background: 'var(--dark)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', flexShrink: 0,
    transition: 'width .2s ease',
  }

  return (
    <>
      {/* Desktop sidebar only (mobile uses BottomNav) - JS check for extra security */}
      {window.innerWidth >= 1024 && (
        <aside style={{ ...sidebarStyle, width: collapsed ? 60 : 220 }}>
          {inner}
        </aside>
      )}
    </>
  )
}
