import { useState } from "react";
import { CheckCircle2, Lock, Zap, ShieldCheck, CreditCard, Loader2, X } from "lucide-react";

export default function Paywall({ user, onUpgrade, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ─── PAYSTACK CONFIG (REMOVED FOR DEV) ───────────────────────────────────
  /* 
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: 250 * 100, // 250 KES in kobo
    publicKey: "pk_test_your_paystack_public_key_here",
    currency: "KES",
  };
  const initializePayment = usePaystackPayment(config);
  */

  const handleDevUpgrade = () => {
    setLoading(true);
    // Simulate successful upgrade for dev
    setTimeout(() => {
      setSuccess(true);
      if (onUpgrade) onUpgrade();
      setLoading(false);
    }, 1000);
  };

  const FEATURES = [
    'Unlimited trend discoveries',
    'AI idea generator — 100+ ideas/day',
    'Full channel analytics & benchmarks',
    'Unlimited saved items & reports',
    'Priority AI processing speed',
    'Weekly trend email digest',
  ]

  if (success) {
    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ maxWidth:400, width:'100%', background:'#111', border:'1px solid var(--border)', borderRadius:20, padding:40, textAlign:'center' }} className="anim-up">
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--white)', color:'var(--black)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 className="t-large" style={{ color:'var(--white)', marginBottom:12 }}>Upgrade Successful!</h2>
          <p style={{ color:'var(--muted)', marginBottom:32 }}>Your ViewHunt Pro features are now unlocked forever.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ width:'100%' }}>Dashboard Access</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ maxWidth:540, width:'100%', background:'var(--dark)', border:'1px solid var(--border)', borderRadius:24, overflow:'hidden', position:'relative' }} className="anim-up">
        
        {onClose && (
          <button onClick={onClose} style={{ position:'absolute', top:20, right:20, background:'transparent', border:'none', color:'var(--muted)', cursor:'pointer' }}>
            <X size={20} />
          </button>
        )}

        <div style={{ padding:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
            <div className="badge" style={{ background:'var(--white)', color:'var(--black)', fontWeight:800, padding:'4px 10px' }}>
              <Lock size={10} style={{ marginRight:4 }} /> PRO MEMBERSHIP
            </div>
          </div>

          <h1 className="t-xl" style={{ color:'var(--white)', marginBottom:12 }}>Trial ended</h1>
          <p style={{ color:'var(--muted)', marginBottom:32, fontSize:15 }}>Upgrade to continue accessing all ViewHunt Pro features.</p>

          <div style={{ padding:32, borderRadius:16, background:'#111', border:'1px solid var(--border)', marginBottom:32, position:'relative', overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <p style={{ fontSize:48, fontWeight:900, color:'var(--white)', lineHeight:1 }}>KES 250</p>
                <p style={{ fontSize:13, color:'var(--muted)', marginTop:8 }}>Lifetime access</p>
              </div>
              <p style={{ fontSize:12, fontWeight:700, color:'var(--muted2)' }}>Cancel anytime</p>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <CheckCircle2 size={16} style={{ color:'var(--muted)' }} />
                <span style={{ fontSize:13, color:'var(--white)', fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleDevUpgrade} 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width:'100%', height:56, fontSize:15, fontWeight:800 }}
          >
            {loading ? <Loader2 size={20} className="anim-spin" /> : 'Upgrade Now — KES 250'}
          </button>

          <p style={{ textAlign:'center', marginTop:20, fontSize:11, color:'var(--muted2)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <ShieldCheck size={12} /> Secured by Paystack · 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  )
}
