import { LayoutDashboard, TrendingUp, Search, BarChart3, BookText, Settings, ShieldCheck, Zap } from 'lucide-react'

export default function Dashboard({ user, onNavigate, savedItems = [] }) {
  const stats = [
    { label: 'Saved Insights', val: savedItems.length.toString(), icon: BookText },
    { label: 'Global Trends', val: '24/7 Live', icon: TrendingUp },
    { label: 'Intelligence', val: 'V3 Active', icon: ShieldCheck },
  ]

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Overview</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Market Dashboard</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Welcome back, {user?.display_name || 'Creator'}. Here is your command center.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 16, background: 'var(--dark)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <s.icon size={18} style={{ color: 'var(--muted)' }} />
              <span className="badge" style={{ background: 'var(--white)', color: 'var(--black)' }}>REAL-TIME</span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--white)', marginBottom: 4 }}>{s.val}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div style={{ padding: 32, borderRadius: 20, background: '#111', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="t-large">Quick Research</h3>
          <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Dive back into your latest viral discovery or audit a new channel.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button onClick={() => onNavigate('trends')} className="btn btn-primary" style={{ flex: 1 }}>Trends Feed</button>
            <button onClick={() => onNavigate('analyzer')} className="btn btn-secondary" style={{ flex: 1 }}>Audit Channel</button>
          </div>
        </div>

        <div style={{ padding: 32, borderRadius: 20, background: 'var(--white)', color: 'var(--black)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Viral Tip of the Day</h3>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>"Channels with less than 10k subs that get 100k+ views on a single topic indicate a massive market gap. Look for those in the Viral Scraper."</p>
          <button onClick={() => onNavigate('scraper')} className="btn" style={{ marginTop: 10, background: 'var(--black)', color: 'var(--white)', border: 'none' }}>Try Scraper</button>
        </div>
      </div>
    </div>
  )
}
