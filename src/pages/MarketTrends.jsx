import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, Search, Flame, Eye, ThumbsUp, Bookmark, ExternalLink, ArrowUp, Minus, ArrowDown, RefreshCw, Users, Zap, Trophy, Globe } from 'lucide-react'

const REGIONS = [
  { label: 'Tanzania (TZ)', id: 'TZ' },
  { label: 'Kenya (KE)', id: 'KE' },
  { label: 'Nigeria (NG)', id: 'NG' },
  { label: 'Global (US)', id: 'US' },
  { label: 'UK (GB)', id: 'GB' },
]

const MODES = [
  { label: 'Viral', id: 'viral', icon: Flame, desc: 'Algorithm Winners (High Velocity)' },
  { label: 'Fast-Growing', id: 'growing', icon: Zap, desc: 'Sleeper Hits (High Engagement)' },
  { label: 'New Creators', id: 'creators', icon: Trophy, desc: 'Gold Mines (Channels < 50k)' }
]

const CATS = [
  { label: 'All', id: '' },
  { label: 'Tech', id: '28' },
  { label: 'Gaming', id: '20' },
  { label: 'Finance', id: '25' },
  { label: 'Music', id: '10' },
  { label: 'Education', id: '27' },
]

export default function MarketTrends({ onSave, savedItems }) {
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('TZ')
  const [mode, setMode] = useState('viral')
  const [cat, setCat] = useState('')
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrends()
  }, [region, mode, cat])

  const fetchTrends = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:3001/api/youtube/trends?mode=${mode}&regionCode=${region}&categoryId=${cat}`)
      const data = await res.json()
      if (res.ok) {
        setTrends(data)
      } else {
        throw new Error(data.error || 'Failed to fetch trends')
      }
    } catch (err) {
      console.error('Trend fetch error:', err)
      setError('Could not connect to YouTube API server.')
    } finally {
      setLoading(false)
    }
  }

  const list = useMemo(() => {
    let filtered = trends.filter(t => 
      t.title.toLowerCase().includes(q.toLowerCase()) || 
      t.channelTitle.toLowerCase().includes(q.toLowerCase())
    )

    // Apply specific mode logic
    const processed = filtered.map(t => {
      // Score = (Views / Hours Alive) + (Likes * 2) + (Comments * 3)
      const engagementScore = Math.floor((t.views / (t.hoursAgo || 1)) + (t.likes * 2) + (t.comments * 3))
      // Scale engagement score to a 0-100 range for the UI bar (logarithmic scale preferred for viral jumps)
      const displayScore = Math.min(100, Math.floor(Math.log10(engagementScore + 1) * 15))

      return { ...t, viralScore: displayScore, rawEngagement: engagementScore }
    })

    if (mode === 'creators') {
      return processed.filter(t => t.subscriberCount < 50000).sort((a, b) => b.velocity - a.velocity)
    }

    if (mode === 'growing') {
      return processed.sort((a, b) => b.rawEngagement - a.rawEngagement)
    }

    return processed.sort((a, b) => b.velocity - a.velocity)
  }, [q, trends, mode])

  const formatCompact = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const saved = savedItems?.map(s => s.id) || []

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <p className="label" style={{ marginBottom:6 }}>Intelligence</p>
          <h1 className="t-xl" style={{ color:'var(--white)', marginBottom:4 }}>Market Trends</h1>
          <p style={{ color:'var(--muted2)', fontSize:13 }}>Identifying real creation opportunities with local algorithms.</p>
        </div>
        
        <div style={{ display:'flex', gap:6, background:'var(--dark)', padding:6, borderRadius:12, border:'1px solid var(--border)' }}>
          {REGIONS.map(r => (
            <button key={r.id} onClick={() => setRegion(r.id)} style={{
              padding:'10px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:800,
              background: region === r.id ? 'var(--white)' : 'transparent',
              color: region === r.id ? 'var(--black)' : 'var(--muted)',
              transition: 'all .2s'
            }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:24 }}>
        {MODES.map(m => {
          const Icon = m.icon
          const active = mode === m.id
          return (
            <div key={m.id} onClick={() => setMode(m.id)} style={{
              padding:20, borderRadius:16, border:'1px solid', cursor:'pointer',
              background: active ? 'rgba(255,255,255,0.03)' : 'var(--dark)',
              borderColor: active ? 'var(--white)' : 'var(--border)',
              transition: 'all .2s',
              position:'relative', overflow:'hidden'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background: active ? 'var(--white)' : 'var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={16} color={active ? 'var(--black)' : 'var(--muted)'} />
                </div>
                <h3 style={{ fontSize:15, fontWeight:800, color: active ? 'var(--white)' : 'var(--muted2)' }}>{m.label}</h3>
              </div>
              <p style={{ fontSize:12, color:'var(--muted)' }}>{m.desc}</p>
              {active && <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'var(--white)' }} />}
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ position:'relative', minWidth:250 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }} />
          <input className="input input-icon" placeholder="Search keywords or channels…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {CATS.map(c => (
            <button key={c.label} onClick={() => setCat(c.id)} style={{
              padding:'8px 14px', borderRadius:8, border:'1px solid', cursor:'pointer', fontSize:11, fontWeight:600,
              background: cat === c.id ? 'var(--white)' : 'transparent',
              color: cat === c.id ? 'var(--black)' : 'var(--muted)',
              borderColor: cat === c.id ? 'var(--white)' : 'var(--border)',
              transition: 'all .2'
            }}>{c.label}</button>
          ))}
          <button onClick={fetchTrends} className="btn-icon">
            <RefreshCw size={14} className={loading ? 'anim-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height:70, borderRadius:12, background:'var(--dark)', border:'1px solid var(--border)', opacity: 0.5 - (i*0.05) }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: 60, textAlign:'center', border:'1px dashed var(--border)', borderRadius:16 }}>
          <p style={{ color:'var(--muted)', marginBottom:16 }}>{error}</p>
          <button onClick={fetchTrends} className="btn btn-primary">Retry Fetch</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 60px', padding:'0 16px 8px', gap:16 }}>
            {['Channel & Content', 'Views', 'Velocity', 'Viral Score', ''].map(h => <span key={h} className="label">{h}</span>)}
          </div>
          {list.map((t, i) => {
            const isSaved = saved.includes(t.id)
            return (
              <div key={t.id} style={{
                display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 60px', alignItems:'center',
                padding:16, gap:16, borderRadius:12, background:'var(--dark)', border:'1px solid var(--border)',
                transition: 'transform .2s, border-color .2s',
                cursor:'default'
              }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--muted)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                
                <div style={{ display:'flex', gap:16, alignItems:'center', minWidth:0 }}>
                  <div style={{ width:80, height:45, borderRadius:6, background:'var(--border)', flexShrink:0, overflow:'hidden' }}>
                    <img src={t.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <h3 style={{ fontSize:14, fontWeight:700, color:'var(--white)', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</h3>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'var(--muted2)', fontWeight:600 }}>{t.channelTitle}</span>
                      <span className="badge" style={{ fontSize:10 }}>{formatCompact(t.subscriberCount)} subs</span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>{Math.floor(t.hoursAgo / 24) > 0 ? `${Math.floor(t.hoursAgo / 24)}d ago` : `${Math.floor(t.hoursAgo)}h ago`}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize:14, fontWeight:700, color:'var(--white)' }}>{formatCompact(t.views)}</div>
                
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <ArrowUp size={12} color="#44ff44" />
                  <span style={{ fontSize:13, fontWeight:800, color:'var(--white)' }}>{formatCompact(t.velocity)}/hr</span>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ width:`${t.viralScore}%`, height:'100%', background: t.viralScore > 80 ? '#44ff44' : '#ffaa00' }} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:800, color:'var(--white)', width:24 }}>{t.viralScore}</span>
                </div>

                <div style={{ display:'flex', justifyContent:'flex-end', gap:4 }}>
                  <button onClick={() => onSave({ ...t, type:'trend' })} className="btn-icon" style={{ borderRadius:8, background: isSaved ? 'var(--white)' : '', color: isSaved ? 'var(--black)' : '' }}>
                    <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
