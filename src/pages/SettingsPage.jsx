import { useState } from 'react'
import { User, Mail, CreditCard, Shield, LogOut, Bell, Edit3, Check, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SettingsPage({ user, onSignOut, onUpgrade, trialStatus }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.display_name || user?.email?.split('@')[0])
  const [loading, setLoading] = useState(false)

  const saveProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', user.id)
      
      if (error) throw error
      setEditing(false)
    } catch (e) {
      console.error('Update failed:', e)
    } finally {
      setLoading(false)
    }
  }

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 40 }}>
      <p className="label" style={{ marginBottom: 20, color: 'var(--muted)' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )

  const Row = ({ label, value, icon: Icon, action }) => (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '16px 20px', borderRadius: 12, background: 'var(--dark)', border: '1px solid var(--border)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon size={18} style={{ color: 'var(--muted)' }} />
        <div>
          <p style={{ fontSize: 12, color: 'var(--muted2)', fontWeight: 600, marginBottom: 2 }}>{label}</p>
          <p style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700 }}>{value}</p>
        </div>
      </div>
      {action && action}
    </div>
  )

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6 }}>System</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Account Settings</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Manage your profile, subscription, and preferences</p>
      </div>

      <div style={{ maxWidth: 800 }}>
        
        <Section title="Account Profile">
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '20px', borderRadius: 16, background: '#111', border: '1px solid var(--border)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--white)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 }}>
                {user.email[0].toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      className="input" 
                      style={{ height: 36, width: 200 }} 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                    <button onClick={saveProfile} className="btn-icon" style={{ background: 'var(--white)', color: 'var(--black)' }}>
                      {loading ? <Loader2 size={14} className="anim-spin" /> : <Check size={14} />}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 className="t-large" style={{ color: 'var(--white)', fontWeight: 800 }}>{user.display_name || name}</h2>
                    <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{user.email}</p>
              </div>
            </div>
            <button onClick={onSignOut} className="btn btn-secondary" style={{ border: '1px solid #331111', color: '#ff6666' }}>
              <LogOut size={16} style={{ marginRight: 8 }} /> Sign Out
            </button>
          </div>
        </Section>

        <Section title="Subscription & Billing">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Row 
              label="Plan Level" 
              value="Developer Unlocked" 
              icon={CreditCard}
            />
            <Row 
              label="Status" 
              value="Unlimited Access" 
              icon={Shield} 
            />
          </div>
        </Section>

        <Section title="Preferences">
          <Row 
            label="Email Notifications" 
            value="Alerts Enabled" 
            icon={Bell}
            action={
              <div style={{ width: 44, height: 24, background: 'var(--white)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, background: 'var(--black)', borderRadius: '50%', position: 'absolute', right: 3, top: 3 }} />
              </div>
            }
          />
        </Section>

        <Section title="Security">
          <div style={{ padding: 20, borderRadius: 12, background: '#111', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              Your account is secured via **Supabase Auth**. To change your password or security settings, please use the Magic Link or reset password flow during login.
            </p>
          </div>
        </Section>

      </div>
    </div>
  )
}
