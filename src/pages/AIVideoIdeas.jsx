import { useState } from 'react'
import { Sparkles, Loader2, Send, Lightbulb, Trash2, Copy, Bookmark, Zap, Target, Book } from 'lucide-react'

export default function AIVideoIdeas({ onSave, savedItems }) {
  const [niche, setNiche] = useState('Tech & AI')
  const [style, setStyle] = useState('Viral Documentary')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState([])
  const [error, setError] = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setIdeas([]) // Clear old ideas
    try {
      const prompt = `Generate 5 viral YouTube video ideas for a ${niche} channel. Style: ${style}. 
      Return ONLY a JSON array of 5 objects. NO conversational text before or after the JSON.
      Objects must have: 
      "title": "catchy clickbaity title", 
      "concept": "1-sentence hook", 
      "score": number 1-100, 
      "tags": ["tag1", "tag2", "tag3"].`

      // Use relative path - Vite proxy will handle this on dev, production build should have server at same origin
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      
      const data = await res.json()
      if (res.ok) {
        const rawContent = data.content || ''
        // Extract JSON if AI includes extra text
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/)
        const jsonStr = jsonMatch ? jsonMatch[0] : rawContent
        
        try {
          const parsed = JSON.parse(jsonStr)
          if (Array.isArray(parsed)) {
            setIdeas(parsed)
          } else {
            throw new Error('AI did not return an array of ideas.')
          }
        } catch (e) {
          console.error('Parse Error:', jsonStr)
          throw new Error('AI returned an invalid response format. Please try again.')
        }
      } else {
        throw new Error(data.error || 'AI request failed')
      }
    } catch (err) {
      console.error('AI Error:', err)
      setError(err.message || 'AI server is unavailable or returned an invalid response.')
    } finally {
      setLoading(false)
    }
  }

  const saved = savedItems?.map(s => s.id) || []

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>Intelligence</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>AI Video Ideas</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Generate high-retention video strategies using LLaMA-3</p>
      </div>

      <div style={{ padding: 24, borderRadius: 16, background: '#111', border: '1px solid var(--border)', marginBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label className="label" style={{ marginBottom: 8, display: 'block' }}>Your Channel Niche</label>
            <select className="input" value={niche} onChange={e => setNiche(e.target.value)}>
              <option>Tech & AI</option>
              <option>Personal Finance</option>
              <option>Gaming & Culture</option>
              <option>Documentary</option>
              <option>Educational</option>
              <option>Vlogs & Lifestyle</option>
            </select>
          </div>
          <div>
            <label className="label" style={{ marginBottom: 8, display: 'block' }}>Video Style</label>
            <select className="input" value={style} onChange={e => setStyle(e.target.value)}>
              <option>Viral Documentary</option>
              <option>High-Retention Challenge</option>
              <option>Educational Deep-dive</option>
              <option>News & Commentary</option>
              <option>ASMR / Relaxing</option>
            </select>
          </div>
          <button onClick={generate} disabled={loading} className="btn btn-primary" style={{ padding: '0 24px', height: 44 }}>
            {loading ? <Loader2 size={16} className="anim-spin" /> : 'Generate Strategies'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 40, border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{error}</p>
          <button onClick={generate} className="btn btn-secondary btn-sm">Retry Request</button>
        </div>
      )}

      {loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 100, borderRadius: 12, background: 'var(--dark)', border: '1px solid var(--border)', opacity: 0.5 - (i * 0.1) }} />
          ))}
        </div>
      )}

      {!ideas.length && !loading && !error && (
        <div style={{ padding: 80, border: '1px dashed var(--border)', borderRadius: 16, textAlign: 'center' }}>
          <Sparkles size={40} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)' }}>Select your niche and style to generate viral video concepts.</p>
        </div>
      )}

      {(Array.isArray(ideas) && ideas.length > 0) && (
        <div className="anim-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', padding: '0 12px 12px', borderBottom: '1px solid var(--border)', gap: 16 }}>
            {['Strategy & Title', 'Viral Potential', ''].map(h => <span key={h} className="label">{h}</span>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ideas.map((idea, i) => {
              const isSaved = saved.includes(idea.title)
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', padding: '20px 12px', borderBottom: '1px solid #1a1a', gap: 16, alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{idea.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--muted2)', marginBottom: 10 }}>{idea.concept}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {idea.tags?.map(t => <span key={t} className="badge">#{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="score-track"><div className="score-fill" style={{ width: `${idea.score}%` }} /></div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--white)' }}>{idea.score}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => navigator.clipboard.writeText(idea.title)} className="btn-icon" title="Copy Title">
                      <Copy size={12} />
                    </button>
                    <button 
                      onClick={() => onSave({ ...idea, id: idea.title, type: 'idea' })} 
                      className="btn-icon" 
                      style={{ background: isSaved ? 'var(--white)' : '', color: isSaved ? 'var(--black)' : '' }}
                    >
                      <Bookmark size={12} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
