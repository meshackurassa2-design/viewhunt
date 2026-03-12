import { useState } from 'react'
import { Search, Loader2, PlayCircle, Eye, ThumbsUp, MessageSquare, Clock, Calendar, Star, ExternalLink, Sparkles, AlertCircle } from 'lucide-react'

export default function VideoIntelligence({ persistedData, onPersist }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(persistedData || null)
  const [error, setError] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(persistedData?.aiAnalysis || '')
  const [analyzingAI, setAnalyzingAI] = useState(false)

  const analyzeVideo = async (e) => {
    if (e) e.preventDefault()
    if (!url) return
    
    setLoading(true)
    setError(null)
    setData(null)
    setAiAnalysis('')
    
    try {
      const res = await fetch(`http://localhost:3001/api/youtube/video?url=${encodeURIComponent(url)}`)
      const result = await res.json()
      if (res.ok) {
        setData(result)
        onPersist({ ...result, aiAnalysis: '' })
        // Auto-start AI analysis once data is in
        runAiAnalysis(result)
      } else {
        throw new Error(result.error || 'Failed to fetch video data')
      }
    } catch (err) {
      setError(err.message || 'Check the URL or server connection.')
    } finally {
      setLoading(false)
    }
  }

  const runAiAnalysis = async (videoData) => {
    setAnalyzingAI(true)
    try {
      const prompt = `Act as a master YouTube Viral Strategist. Deeply analyze this video data:
      Title: ${videoData.title}
      Views: ${videoData.views}
      Likes: ${videoData.likes}
      Comments: ${videoData.comments}
      Tags: ${videoData.tags.join(', ')}
      Duration: ${videoData.duration}
      
      Provide a "Viral Pattern Breakdown":
      1. Why is this video performing well? (Psychological hooks)
      2. Re-replication Strategy: 3 ideas for a new video riding this same wave.
      3. Suggest 3 high-CTR titles for this niche.
      Format the response in clear, premium section headers.`
      
      const res = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const result = await res.json()
      setAiAnalysis(result.content)
      onPersist({ ...data, aiAnalysis: result.content })
    } catch (err) {
      setAiAnalysis('AI Analysis failed. Please try again.')
    } finally {
      setAnalyzingAI(false)
    }
  }

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Intelligence</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Video Intelligence</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Deep AI-powered analysis of any specific YouTube video</p>
      </div>

      <form onSubmit={analyzeVideo} style={{ display: 'flex', gap: 10, marginBottom: 40, maxWidth: 600 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <PlayCircle size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            className="input input-icon" 
            placeholder="Paste YouTube Video URL (e.g., https://youtube.com/watch?v=...)" 
            value={url} 
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 24px' }}>
          {loading ? <Loader2 size={16} className="anim-spin" /> : 'Analyze Link'}
        </button>
      </form>

      {error && (
        <div style={{ padding: 24, background: 'rgba(255,0,0,0.05)', border: '1px solid #311', borderRadius: 12, color: 'var(--muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertCircle size={20} color="#ff4444" />
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: 24, flexWrap: 'wrap' }}>
          
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Video Overview */}
            <div style={{ padding: 24, borderRadius: 16, background: '#111', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <img src={data.thumbnail} alt="" style={{ width: 240, height: 135, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border)' }} />
                <div>
                  <h2 style={{ color: 'var(--white)', fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{data.title}</h2>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge">{data.channelTitle}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(data.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <a href={url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ height: 32, fontSize: 11 }}>
                    <ExternalLink size={12} style={{ marginRight: 6 }} /> View Original
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Views', val: data.views, icon: Eye },
                  { label: 'Likes', val: data.likes, icon: ThumbsUp },
                  { label: 'Comments', val: data.comments, icon: MessageSquare },
                  { label: 'Length', val: data.duration.replace('PT','').toLowerCase(), icon: Clock },
                ].map(s => (
                  <div key={s.label} style={{ padding: 12, borderRadius: 8, background: 'var(--dark2)', textAlign: 'center' }}>
                    <s.icon size={14} style={{ color: 'var(--muted)', marginBottom: 6 }} />
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--white)' }}>{s.val}</p>
                    <p style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights Card */}
            <div style={{ padding: 32, borderRadius: 16, background: 'var(--white)', color: 'var(--black)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Sparkles size={20} />
                <h3 style={{ fontWeight: 800, fontSize: 18 }}>Viral Pattern Analysis</h3>
              </div>
              
              {analyzingAI ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
                  <Loader2 size={32} className="anim-spin" />
                  <p style={{ fontWeight: 600 }}>AI Strategist is deconstructing the algorithm...</p>
                </div>
              ) : (
                <div style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ padding: 20, borderRadius: 12, background: 'var(--dark)', border: '1px solid var(--border)' }}>
              <h3 className="label" style={{ marginBottom: 16 }}>Video Tags ({data?.tags?.length || 0})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(Array.isArray(data?.tags) ? data.tags : []).map(t => (
                  <span key={t} className="badge" style={{ background: 'var(--dark2)', border: '1px solid var(--border)' }}>{t}</span>
                ))}
              </div>
            </div>
            
            <div style={{ padding: 20, borderRadius: 12, background: 'var(--dark)', border: '1px solid var(--border)' }}>
              <h3 className="label" style={{ marginBottom: 16 }}>Channel Intelligence</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--white)' }} />
                <div>
                  <p style={{ color: 'var(--white)', fontWeight: 600, fontSize: 14 }}>{data.channelTitle}</p>
                  <p style={{ color: 'var(--muted)', fontSize: 11 }}>Channel: {data.channelId}</p>
                </div>
              </div>
              <button disabled className="btn btn-secondary" style={{ width: '100%', opacity: 0.5 }}>Audit This Channel</button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
