import { TrendingUp, BarChart3, ShieldCheck, BookText, Lightbulb, Zap } from 'lucide-react'

export default function Dashboard({ user, onNavigate, savedItems = [] }) {
  const stats = [
    { label: 'Saved', val: savedItems.length.toString(), icon: BookText },
    { label: 'Live Trends', val: '24/7', icon: TrendingUp },
    { label: 'AI Engine', val: 'ON', icon: ShieldCheck },
  ]

  const cards = [
    { label: 'Market Trends', desc: 'See what is trending right now on YouTube globally.', action: 'trends', icon: TrendingUp, cta: 'Open Trends' },
    { label: 'Viral Scraper', desc: 'Find videos going viral before everyone else.', action: 'scraper', icon: Zap, cta: 'Scrape Now' },
    { label: 'Channel Audit', desc: 'Deep-dive any YouTube channel with real metrics.', action: 'analyzer', icon: BarChart3, cta: 'Audit Channel' },
    { label: 'AI Video Ideas', desc: 'Generate viral video ideas powered by YouTube data.', action: 'ideas', icon: Lightbulb, cta: 'Generate Ideas' },
  ]

  return (
    <div className="page-wrap anim-up">
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p className="label" style={{ marginBottom: 4 }}>Overview</p>
        <h1 className="t-xl" style={{ color: '#fff', marginBottom: 6 }}>Market Dashboard</h1>
        <p style={{ color: '#888', fontSize: 13 }}>Welcome back, {user?.display_name || 'Creator'}.</p>
      </div>

      {/* Stat Cards — 3 columns always, responsive font */}
      <div className="stat-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 10, 
        marginBottom: 24 
      }}>
        {stats.map(s => (
          <div key={s.label} style={{ 
            padding: '14px 10px', 
            borderRadius: 12, 
            background: '#111', 
            border: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <s.icon size={16} style={{ color: '#555' }} />
            <p className="stat-val" style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.val}</p>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards — 2 columns on tablet+, 1 on mobile */}
      <div className="action-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 16
      }}>
        {cards.map(c => (
          <div key={c.label} style={{ 
            padding: '20px 18px', 
            borderRadius: 16, 
            background: '#111', 
            border: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <c.icon size={18} style={{ color: '#fff' }} />
              <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>{c.label}</span>
            </div>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{c.desc}</p>
            <button 
              onClick={() => onNavigate(c.action)}
              style={{ 
                marginTop: 4,
                padding: '9px 16px',
                borderRadius: 8,
                background: '#fff',
                color: '#000',
                border: 'none',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                alignSelf: 'flex-start',
                letterSpacing: '0.03em'
              }}
            >
              {c.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Tip card */}
      <div style={{ 
        padding: '18px 16px', 
        borderRadius: 14, 
        background: '#fff', 
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333' }}>💡 Viral Tip</span>
        <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6 }}>
          "Channels under 10K subs getting 100K+ views on one topic = massive niche gap. Hunt those in the Viral Scraper."
        </p>
        <button 
          onClick={() => onNavigate('scraper')}
          style={{ padding: '8px 14px', borderRadius: 8, background: '#000', color: '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer', alignSelf: 'flex-start' }}
        >
          Try Scraper
        </button>
      </div>

    </div>
  )
}

