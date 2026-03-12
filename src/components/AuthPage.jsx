import { useState } from 'react'
import { Youtube, Mail, Lock, User, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { mockAuth } from '../lib/auth'

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const pulse = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const promise = isLogin 
      ? mockAuth.signInWithEmailAndPassword(email, password)
      : mockAuth.createUserWithEmailAndPassword(email, password, name)

    promise
      .then(res => {
        onAuth(res.user)
      })
      .catch(err => {
        setError(err.message || 'Authentication failed. Please check your credentials.')
        setLoading(false)
      })
  }

  const FEATURES = [
    'Real-time YouTube Trend Discovery',
    'AI-Powered Viral Strategy Engine',
    'Full Channel Performance Audits',
    'Explosive Content Idea Generator',
  ]

  return (
    <div style={{ display:'flex', minHeight:'100vh', flexDirection: 'column', background:'var(--black)', overflowY:'auto' }} className="md-row">
      
      {/* Left Panel: Hero */}
      <div style={{ 
        flex: 1, padding: 40, display: showMobileForm ? 'none' : 'flex', flexDirection: 'column', 
        justifyContent: 'center', background: '#050505', borderRight: '1px solid var(--border)' 
      }} className="auth-hero md-flex-always">
        <div style={{ maxWidth: 480 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'var(--white)', color:'var(--black)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Youtube size={20} />
            </div>
            <span style={{ fontWeight:900, fontSize:20, color:'var(--white)', letterSpacing:'-0.5px' }}>ViewHunt Pro</span>
          </div>

          <h1 style={{ fontSize:48, fontWeight:900, color:'var(--white)', lineHeight:1.1, marginBottom:24, letterSpacing:'-1px' }}>
            Discover viral opportunities <span style={{ color:'var(--muted)' }}>before everyone else.</span>
          </h1>

          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:40 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <CheckCircle2 size={18} style={{ color:'var(--white)' }} />
                <span style={{ fontSize:15, color:'var(--muted)', fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize:13, color:'var(--muted2)', borderTop:'1px solid #111', paddingTop:24 }}>
            Join 5,000+ creators using AI to dominate the algorithm.
          </p>

          <div className="md:hidden" style={{ marginTop: 32 }}>
            <button onClick={() => setShowMobileForm(true)} className="btn btn-primary" style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 800 }}>
              Continue <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div style={{ flex: 1, display: showMobileForm ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', padding: 20 }} className="md-flex-always">
        <div style={{ maxWidth: 360, width: '100%' }} className="anim-up">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="t-large" style={{ color: 'var(--white)', marginBottom: 8 }}>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{isLogin ? 'Sign in to access your dashboard' : 'Join the next generation of creators'}</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#221111', border: '1px solid #441111', borderRadius: 8, color: '#ff6666', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={pulse} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
                <input required className="input input-icon" placeholder="Display Name" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
              <input required type="email" className="input input-icon" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
              <input required type="password" className="input input-icon" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button disabled={loading} className="btn btn-primary" style={{ height: 44, marginTop: 8, fontSize: 14, fontWeight: 800 }}>
              {loading ? <Loader2 size={16} className="anim-spin" /> : (isLogin ? 'Sign In' : 'Get Started')}
              <ArrowRight size={14} style={{ marginLeft: 8 }} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--muted2)' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--white)', fontWeight: 700, marginLeft: 6, cursor: 'pointer' }}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 24 }}>
            <p style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em' }}>
              &copy; {new Date().getFullYear()} dapazcm. All rights reserved.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
