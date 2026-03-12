import { useState, useMemo } from 'react'
import { Bookmark, TrendingUp, BarChart3, Lightbulb, Trash2, Search } from 'lucide-react'

const CFG = {
  trend:   { icon:TrendingUp, label:'Trend'   },
  channel: { icon:BarChart3,  label:'Channel' },
  idea:    { icon:Lightbulb,  label:'Idea'    },
}

export default function SavedItems({ savedItems, onRemove }) {
  const [q,   setQ]   = useState('')
  const [filter, setFilter] = useState('All')

  const list = useMemo(() =>
    savedItems.filter(item => {
      const name = (item.keyword||item.name||item.title||'').toLowerCase()
      return name.includes(q.toLowerCase()) && (filter==='All' || item.type===filter.toLowerCase())
    }), [savedItems, q, filter])

  const counts = { trend:0, channel:0, idea:0 }
  savedItems.forEach(i => { if (counts[i.type] !== undefined) counts[i.type]++ })

  return (
    <div className="page-wrap anim-up">
      {/* Header */}
      <div style={{ marginBottom:32, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <p className="label" style={{ marginBottom:6 }}>Dashboard</p>
          <h1 className="t-xl" style={{ color:'var(--white)', marginBottom:4 }}>Saved Items</h1>
          <p style={{ color:'var(--muted2)', fontSize:13 }}>Your personal research vault</p>
        </div>
        {/* Summary pills */}
        <div style={{ display:'flex', gap:8 }}>
          {Object.entries(CFG).map(([type, cfg]) => (
            <div key={type} style={{
              padding:'10px 16px', borderRadius:9, background:'var(--dark)', border:'1px solid var(--border)',
              display:'flex', alignItems:'center', gap:8,
            }}>
              <cfg.icon size={13} color="var(--muted)" />
              <span style={{ fontWeight:800, fontSize:18, color:'var(--white)' }}>{counts[type]}</span>
              <span style={{ fontSize:12, color:'var(--muted)' }}>{cfg.label}{counts[type]!==1?'s':''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }} />
          <input className="input input-icon" placeholder="Search saved items…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        {['All','Trend','Channel','Idea'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'9px 16px', borderRadius:7, border:'1px solid', cursor:'pointer', fontSize:12, fontWeight:600,
            background:filter===f?'var(--white)':'transparent',
            color:filter===f?'var(--black)':'var(--muted)',
            borderColor:filter===f?'var(--white)':'var(--border)',
          }}>{f}</button>
        ))}
      </div>

      {/* Empty */}
      {savedItems.length===0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{
            width:56, height:56, borderRadius:14, background:'var(--dark)', border:'1px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
          }} className="anim-float">
            <Bookmark size={24} color="var(--muted)" />
          </div>
          <p style={{ fontWeight:700, color:'var(--white)', marginBottom:6 }}>Nothing saved yet</p>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Bookmark trends, channels, and AI ideas to build your vault.</p>
        </div>
      )}

      {/* No match */}
      {savedItems.length>0 && list.length===0 && (
        <p style={{ color:'var(--muted)', textAlign:'center', padding:'40px 0' }}>No items match your search.</p>
      )}

      {/* List */}
      {list.length>0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {/* Column header */}
          <div style={{ display:'grid', gridTemplateColumns:'28px 1fr 90px 100px 36px', gap:14, padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
            {['','Name','Type','Detail',''].map((h,i)=><span key={i} className="label">{h}</span>)}
          </div>
          {list.map((item,i)=>{
            const cfg = CFG[item.type]||CFG.trend
            const name = item.keyword||item.name||item.title||'Item'
            const detail = item.type==='trend' ? `${item.views} · ${item.eng}` : item.type==='channel' ? `${item.subscribers} subs` : item.tags?.slice(0,2).join(', ') || '—'
            return (
              <div key={item.id||i}
                style={{ display:'grid', gridTemplateColumns:'28px 1fr 90px 100px 36px', gap:14, padding:'12px', borderRadius:8, alignItems:'center', transition:'all .15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='var(--dark)'; e.currentTarget.style.border='1px solid var(--border)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.border='1px solid transparent'; }}
              >
                <cfg.icon size={14} color="var(--muted)" />
                <span style={{ fontWeight:600, fontSize:13, color:'var(--white)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</span>
                <span className="badge">{cfg.label}</span>
                <span style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{detail}</span>
                <button onClick={()=>onRemove(item)} className="btn-icon" style={{ width:28, height:28 }}>
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
