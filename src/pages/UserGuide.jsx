import { Book, HelpCircle, Target, TrendingUp, Zap, ShieldCheck } from 'lucide-react'

export default function UserGuide() {
  const steps = [
    { title: 'Step 1: Setup', desc: 'Enter your YouTube API key in Settings if you have one, or use our free fallbacks.', icon: ShieldCheck },
    { title: 'Step 2: Trend Hunt', desc: 'Browse the Market Trends to see what is blowing up right now in your region.', icon: TrendingUp },
    { title: 'Step 3: Viral Scrape', desc: 'Use keywords to find specific niches where small channels are getting massive views.', icon: Zap },
    { title: 'Step 4: AI Strategy', desc: 'Audit identified channels and use AI to remix their success into your own scripts.', icon: Target },
  ]

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Manual</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>User Guide</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Master the ViewHunt Pro system and grow your channel.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
        {steps.map(s => (
          <div key={s.title} style={{ padding: 32, borderRadius: 20, background: 'var(--dark)', border: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--white)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <s.icon size={20} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: 40, borderRadius: 24, background: '#111', border: '1px solid var(--border)' }}>
        <h2 className="t-large" style={{ marginBottom: 20 }}>Understanding the Viral Ratio</h2>
        <p style={{ color: 'var(--muted2)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          The **Viral Ratio** is our secret sauce. It compares a videos view count to the channels total subscriber count. 
          When a channel with 500 subscribers gets 1,000,000 views, it has a massive viral ratio—indicating that the TOPIC itself is carrying the video, not the brand. 
          Remixing these topics is the fastest way to grow.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge" style={{ background: 'var(--white)', color: 'var(--black)' }}>PRO TIP</span>
          <span className="badge">USE AI TITLES</span>
          <span className="badge">CHECK TRENDS DAILY</span>
        </div>
      </div>
    </div>
  )
}
