import { useState } from 'react'
import { Search, Loader2, Youtube, Users, Eye, BarChart2, PlayCircle, Star, ExternalLink, Sparkles, MessageSquare, Info } from 'lucide-react'

export default function ChannelAudit({ onSave, savedItems, persistedData, onPersist }) {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(persistedData || null)
  const [error, setError] = useState(null)
  
  // AI Analyst states
  const [analyzingAI, setAnalyzingAI] = useState(false)
  const [aiReport, setAiReport] = useState(persistedData?.aiReport || '')

  const analyze = async (e) => {
    if (e) e.preventDefault()
    if (!handle) return
    
    setLoading(true)
    setError(null)
    setAiReport('')
    try {
      const res = await fetch(`http://localhost:3001/api/youtube/channel?handle=${encodeURIComponent(handle)}`)
      const result = await res.json()
      if (res.ok) {
        setData(result)
        onPersist(result)
      } else {
        throw new Error(result.error || 'Failed to analyze channel')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.message || 'Check channel URL or server connection.')
    } finally {
      setLoading(false)
    }
  }

  const runAiAudit = async () => {
    if (!data) return
    setAnalyzingAI(true)
    try {
      const prompt = `Act as a master YouTube Strategist. Deeply analyze this channel:
      Name: ${data.name}
      Subs: ${data.subscribers}
      Total Views: ${data.totalViews}
      Description: ${data.description.substring(0, 500)}...
      Recent Performance: ${data.topVideos.map(v => `${v.title} (${v.views}, Ratio: ${v.ratio})`).join(' | ')}
      
      Provide:
      1. Growth SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
      2. The "Next Big Move": 1 specific content idea to double engagement.
      3. Retention Strategy: How to turn one-time viewers into subscribers for this specific niche.
      Format in clear, bulleted headers with a premium tone.`

      const res = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const result = await res.json()
      setAiReport(result.content)
      onPersist({ ...data, aiReport: result.content })
    } catch (e) {
      setAiReport('Failed to generate AI report. Please try again.')
    } finally {
      setAnalyzingAI(false)
    }
  }

  const isSaved = savedItems?.some(s => s.type === 'channel' && s.handle === (data?.handle))

  return (
    <div className="page-wrap anim-up">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Intelligence</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Channel Auditor</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>In-depth performance audit with AI strategic planning</p>
      </div>

      {/* Input */}
      <form onSubmit={analyze} style={{ display: 'flex', gap: 10, marginBottom: 40, maxWidth: 600 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Youtube size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            className="input input-icon" 
            placeholder="Enter Channel Name or @Handle..." 
            value={handle} 
            onChange={e => setHandle(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 24px' }}>
          {loading ? <Loader2 size={16} className="anim-spin" /> : 'Audit Channel'}
        </button>
      </form>

      {error && (
        <div style={{ padding: 40, border: '1px solid #322', borderRadius: 12, textAlign: 'center', background: 'rgba(255,0,0,0.02)' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{error}</p>
          <p style={{ fontSize: 12, color: 'var(--muted2)' }}>Try using the channel name or exact handle (e.g., @MrBeast)</p>
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{ padding: 80, border: '1px dashed var(--border)', borderRadius: 16, textAlign: 'center' }}>
          <BarChart2 size={40} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)' }}>Enter a channel handle to see stats, engagement, and AI-powered viral strategy.</p>
        </div>
      )}

      {data && !loading && (
        <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Profile Header Card */}
          <div style={{ padding: 24, borderRadius: 16, background: '#111', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--mid)', border: '2px solid var(--white)', overflow: 'hidden', flexShrink: 0 }}>
                {data.avatar ? (
                  <img src={data.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={32} color="var(--muted)" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="t-lg" style={{ color: 'var(--white)', marginBottom: 4 }}>{data.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{data.handle}</span>
                  <span className="badge">{data.category}</span>
                  <span className="badge" style={{ background: 'var(--white)', color: 'var(--black)' }}>API Verified</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => onSave({ ...data, type: 'channel', id: data.handle })} 
                className="btn btn-secondary" 
                style={{ height: 40, background: isSaved ? 'var(--white)' : '', color: isSaved ? 'var(--black)' : '' }}
              >
                <Star size={14} fill={isSaved ? 'currentColor' : 'none'} style={{ marginRight: 8 }} />
                {isSaved ? 'Audited & Saved' : 'Save Audit'}
              </button>
              <a href={`https://youtube.com/${data.handle}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ height: 40 }}>
                <ExternalLink size={14} style={{ marginRight: 8 }} /> Open YT
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Subscribers', val: data.subscribers.split(' ')[0], icon: Users },
              { label: 'Total Views', val: data.totalViews, icon: Eye },
              { label: 'Video Count', val: data.videoCount, icon: PlayCircle },
              { label: 'Engage Rate', val: data.engRate, icon: MessageSquare },
            ].map(s => (
              <div key={s.label} style={{ padding: 20, borderRadius: 12, background: 'var(--dark)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <s.icon size={16} style={{ color: 'var(--muted)' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }} className="label">LIVE</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--white)', marginBottom: 4 }}>{s.val}</p>
                <p style={{ fontSize: 12, color: 'var(--muted2)', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Top Videos Table */}
              <div style={{ padding: 24, borderRadius: 16, background: 'var(--dark)', border: '1px solid var(--border)' }}>
                <h3 className="label" style={{ marginBottom: 20 }}>Recent Viral Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px', padding: '0 12px 12px', borderBottom: '1px solid var(--border)', gap: 16 }}>
                  {['Video Title', 'Views', 'Viral Ratio', 'Status'].map(h => <span key={h} className="label">{h}</span>)}
                </div>
                {(Array.isArray(data?.topVideos) ? data.topVideos : []).map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px', padding: '16px 12px', borderBottom: i === (data.topVideos.length - 1) ? 'none' : '1px solid #222', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--white)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</span>
                    <span style={{ fontSize: 13, color: 'var(--white)' }}>{v.views}</span>
                    <span style={{ fontSize: 13, color: 'var(--white)', fontWeight: 700 }}>{v.ratio}x</span>
                    <span className="badge" style={{ 
                      background: v.score === 'Exploding' ? 'var(--white)' : 'transparent',
                      color: v.score === 'Exploding' ? 'var(--black)' : 'var(--muted)'
                    }}>{v.score}</span>
                  </div>
                ))}
              </div>

              {/* Bio / Description */}
              <div style={{ padding: 24, borderRadius: 16, background: 'var(--dark)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Info size={16} color="var(--muted)" />
                  <h3 className="label">Channel Intelligence</h3>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', maxHeight: 150, overflow: 'hidden' }}>{data.description || 'No description provided.'}</p>
                <p style={{ marginTop: 12, fontSize: 12, color: 'var(--white)', fontWeight: 600 }}>ID: {data.handle} • Total Audits: 142</p>
              </div>
            </div>

            {/* AI Strategist Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ padding: 24, borderRadius: 16, background: 'var(--white)', color: 'var(--black)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Sparkles size={32} style={{ marginBottom: 12 }} />
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>AI Analyst</h3>
                <p style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.8, marginBottom: 20 }}>Deconstruct this channel's architecture and discover the "Viral Gap".</p>
                
                {analyzingAI ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Loader2 size={24} className="anim-spin" />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Deconstructing Algorithm...</span>
                  </div>
                ) : (
                  <button onClick={runAiAudit} className="btn" style={{ width: '100%', background: 'var(--black)', color: 'var(--white)', border: 'none', height: 44, fontWeight: 700 }}>
                    Generate Strategy 
                  </button>
                )}
              </div>

              {aiReport && (
                <div className="anim-up" style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--dark)' }}>
                  <h3 className="label" style={{ marginBottom: 16, color: 'var(--white)' }}>Growth Strategy</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>
                    {aiReport}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
