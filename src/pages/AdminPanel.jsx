import { useState, useEffect } from 'react'
import { ShieldCheck, Users, Zap, BarChart, Loader2, Star, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, trials: 0, pro: 0, revenue: '$0' })
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      // Fetch User Count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch Pro Count
      const { count: proCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_pro', true)

      // Fetch Latest Users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      setStats({
        users: userCount || 0,
        trials: 0, // Logic for trials can be added later if tracked
        pro: proCount || 0,
        revenue: '$0' // Stripe integration not yet active
      })
      setUserList(users || [])
    } catch (e) {
      console.error('Admin fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="anim-spin" size={32} color="var(--muted)" />
      </div>
    )
  }

  return (
    <div className="page-wrap anim-up">
      <div style={{ marginBottom: 32 }}>
        <p className="label" style={{ marginBottom: 6, color: '#ff4444' }}>Admin Only</p>
        <h1 className="t-xl" style={{ color: 'var(--white)', marginBottom: 4 }}>Control Center</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Global monitoring and user management for ViewHunt Pro.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total Users', val: stats.users, icon: Users },
          { label: 'Pro Members', val: stats.pro, icon: Star },
          { label: 'Revenue', val: stats.revenue, icon: BarChart },
        ].map(s => (
          <div key={s.label} className="surface-1" style={{ padding: 24 }}>
            <s.icon size={16} style={{ color: 'var(--muted)', marginBottom: 12 }} />
            <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--white)', marginBottom: 4 }}>{s.val}</p>
            <p style={{ fontSize: 11, color: 'var(--muted2)', fontWeight: 700 }}>{s.label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      <div className="surface-1" style={{ padding: '32px 24px' }}>
        <h3 className="label" style={{ marginBottom: 20 }}>Latest Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User Email', 'Plan', 'Joined', 'Action'].map(h => (
                  <th key={h} className="label" style={{ textAlign: 'left', paddingBottom: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userList.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--white)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Mail size={14} color="var(--muted2)" />
                      {u.email}
                    </div>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <span className={`badge ${u.is_admin ? 'badge-white' : ''}`}>
                      {u.is_admin ? 'ADMIN' : (u.is_pro ? 'PRO' : 'FREE')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: 12, color: 'var(--muted2)' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
