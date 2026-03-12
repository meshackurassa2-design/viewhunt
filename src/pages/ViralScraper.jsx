import { useState } from 'react'
import { Search, Loader2, Zap, TrendingUp, Star, Filter, ArrowUpRight, Play, Eye, Bookmark } from 'lucide-react'

export default function ViralScraper({ onSave, savedItems }) {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const scrape = async (e) => {
    if (e) e.preventDefault()
    if (!keyword) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`http://localhost:3001/api/youtube/trends?keyword=${encodeURIComponent(keyword)}&mode=niche`)
      const data = await res.json()
      if (res.ok) {
        setResults(data)
      } else {
        throw new Error(data.error || 'Scrape failed')
      }
    } catch (err) {
      setError('Failed to reach data engine. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const formatCompact = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const isSaved = (id) => savedItems?.some(s => s.id === id)

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Discovery</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Viral Scraper</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Search any niche to find breakout videos from the last 72 hours.</p>
      </div>

      <form onSubmit={scrape} style={{ display: 'flex', gap: 10, marginBottom: 40, maxWidth: 600 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            className="input input-icon" 
            placeholder="Enter niche keywords (e.g. AI Automation, Stoicism)..." 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 24px' }}>
          {loading ? <Loader2 size={16} className="anim-spin" /> : 'Scrape Niche'}
        </button>
      </form>

      {error && (
        <div style={{ padding: 20, background: 'rgba(255,0,0,0.05)', border: '1px solid #322', borderRadius: 12, color: 'var(--muted)', marginBottom: 24 }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="anim-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 60px', padding: '0 12px 12px', borderBottom: '1px solid var(--border)', gap: 16 }}>
            {['Video Blueprint', 'Views', 'Velocity', 'Subs', ''].map(h => <span key={h} className="label">{h}</span>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {results.map((v, i) => (
              <div key={v.id || i} style={itemStyle}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
                  <div style={{ width: 80, height: 45, borderRadius: 6, background: 'var(--dark2)', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={v.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="badge" style={{ fontSize: 9 }}>{Math.floor(v.hoursAgo / 24) > 0 ? `${Math.floor(v.hoursAgo / 24)}d ago` : `${Math.floor(v.hoursAgo)}h ago`}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{v.channelTitle}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 600 }}>{formatCompact(v.views)}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={12} color="#44ff44" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--white)' }}>{formatCompact(v.velocity)}/hr</span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatCompact(v.subscriberCount)}</div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button 
                    onClick={() => onSave({ ...v, type: 'video' })} 
                    className="btn btn-secondary" 
                    style={{ height: 32, padding: '0 12px', fontSize: 11, background: isSaved(v.id) ? 'var(--white)' : '', color: isSaved(v.id) ? 'var(--black)' : '' }}
                  >
                    <Bookmark size={14} fill={isSaved(v.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!results.length && !loading && !error && (
        <div style={{ padding: 80, border: '1px dashed var(--border)', borderRadius: 16, textAlign: 'center' }}>
          <Zap size={40} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)' }}>Enter a niche or topic to discover hidden viral gems and gaps.</p>
        </div>
      )}
    </div>
  )
}

const itemStyle = {
  display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 60px', 
  padding: '16px 12px', background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 12, gap: 16, 
  alignItems: 'center', transition: 'border-color .2s'
}
