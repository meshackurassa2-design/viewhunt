import { useState, useEffect, useCallback } from 'react'
import { Settings, ShieldCheck } from 'lucide-react'
import { supabase } from './lib/supabase'
import { mockAuth } from './lib/auth'

import AuthPage from './components/AuthPage'
import Sidebar from './components/Sidebar'
import Paywall from './components/Paywall'

import Dashboard from './pages/Dashboard'
import MarketTrends from './pages/MarketTrends'
import ViralScraper from './pages/ViralScraper'
import ChannelAudit from './pages/ChannelAudit'
import AIVideoIdeas from './pages/AIVideoIdeas'
import IdeaNotepad from './pages/IdeaNotepad'
import BottomNav from './components/BottomNav'
import AnimatedSplash from './components/AnimatedSplash'
import SettingsPage from './pages/SettingsPage'
import UserGuide from './pages/UserGuide'
import AdminPanel from './pages/AdminPanel'
import VideoIntelligence from './pages/VideoIntelligence'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('dashboard')
  const [showPaywall, setShowPaywall] = useState(false)
  const [savedItems, setSavedItems] = useState([])
  const [trialStatus, setTrialStatus] = useState({ isActive: false, remaining: 0 })
  const [auditedChannel, setAuditedChannel] = useState(null)
  const [videoIntelData, setVideoIntelData] = useState(null)
  const [showSplash, setShowSplash] = useState(true)

  // ─── AUTH LISTENER ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = mockAuth.onAuthStateChanged(async (u) => {
      setUser(u)
      if (u) {
        await fetchProfile(u.id)
        await fetchSavedItems(u.id)
      } else {
        setProfile(null)
        setSavedItems([])
      }
      setLoading(false)
    })
    return () => { if (typeof unsub === 'function') unsub() }
  }, [])

  const fetchProfile = async (uid) => {
    try {
      const p = await mockAuth.getProfile(uid)
      setProfile(p)
    } catch (e) {
      console.error('Profile fetch failed:', e)
    }
  }

  const fetchSavedItems = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', uid)
      
      if (error) throw error
      setSavedItems(data.map(item => ({ ...item.data, type: item.type, dbId: item.id })))
    } catch (e) {
      console.error('Saved items fetch failed:', e)
    }
  }

  // ─── TRIAL TIMER (DISABLED FOR DEV) ──────────────────────────────────────────
  useEffect(() => {
    // Force paywall off and timer inactive during development
    setTrialStatus({ isActive: false, remaining: 0 })
    setShowPaywall(false)
    
    /* Original logic commented out for dev:
    if (!profile || profile.is_pro || profile.is_admin) {
      setTrialStatus({ isActive: false, remaining: 0 })
      setShowPaywall(false)
      return
    }

    const timer = setInterval(() => {
      const expires = new Date(profile.trial_expires_at).getTime()
      const now = Date.now()
      const diff = expires - now

      if (diff <= 0) {
        setTrialStatus({ isActive: false, remaining: 0 })
        setShowPaywall(true)
        clearInterval(timer)
      } else {
        setTrialStatus({ isActive: true, remaining: diff })
        setShowPaywall(false)
      }
    }, 1000)

    return () => clearInterval(timer)
    */
  }, [profile])

  // ─── ACTIONS ──────────────────────────────────────────────────────────────
  const handleSave = async (item) => {
    if (!user) return
    const isSaved = savedItems.some(s => s.id === item.id)
    if (isSaved) return

    try {
      const { data, error } = await supabase
        .from('saved_items')
        .insert({
          user_id: user.id,
          type: item.type,
          item_key: item.id?.toString() || item.keyword || item.title,
          data: item
        })
        .select()
        .single()

      if (error) throw error
      setSavedItems(prev => [...prev, { ...item, dbId: data.id }])
    } catch (e) {
      console.error('Save failed:', e)
    }
  }

  const handleRemove = async (item) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', item.dbId)

      if (error) throw error
      setSavedItems(prev => prev.filter(s => s.dbId !== item.dbId))
    } catch (e) {
      console.error('Remove failed:', e)
    }
  }

  const handleUpgrade = async () => {
    await fetchProfile(user.id)
  }

  useEffect(() => {
    // FORCE NATIVE LOCKDOWN - No movement, no zoom, no scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100dvh';
    document.body.style.overscrollBehavior = 'none';

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (loading || showSplash) {
    return <AnimatedSplash onFinish={handleSplashFinish} />
  }

  if (!user) return <AuthPage onAuth={setUser} />

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <Dashboard user={profile || user} onNavigate={setPage} savedItems={savedItems} />
      case 'trends':    return <MarketTrends onSave={handleSave} savedItems={savedItems} />
      case 'scraper':   return <ViralScraper onSave={handleSave} savedItems={savedItems} />
      case 'analyzer':  return <ChannelAudit onSave={handleSave} savedItems={savedItems} persistedData={auditedChannel} onPersist={setAuditedChannel} />
      case 'ideas':     return <AIVideoIdeas onSave={handleSave} savedItems={savedItems} />
      case 'notepad':   return <IdeaNotepad savedItems={savedItems} onRemove={handleRemove} />
      case 'guide':     return <UserGuide />
      case 'admin':     return user?.email === 'meshackurassa2@gmail.com' ? <AdminPanel /> : <Dashboard user={profile || user} onNavigate={setPage} savedItems={savedItems} />
      case 'video-intel': return <VideoIntelligence persistedData={videoIntelData} onPersist={setVideoIntelData} />
      case 'settings':  return <SettingsPage user={{ ...user, ...profile }} trialStatus={trialStatus} onSignOut={() => setUser(null)} onUpgrade={() => setPage('upgrade')} />
      case 'upgrade':   return <Paywall user={user} onUpgrade={handleUpgrade} onClose={() => setPage('dashboard')} />
      default: return <Dashboard user={profile || user} onNavigate={setPage} />
    }
  }

  return (
    <div id="app-root-lock" className="v-lock">
      
      {/* MOBILE TOP BAR - iPhone Mini Safe Area Fix */}
      {!isDesktop && (
        <div style={{ 
          paddingTop: 'env(safe-area-inset-top, 44px)',
          background: '#000',
          zIndex: 1000,
          flexShrink: 0
        }}>
          <div style={{ 
            height: 48, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingLeft: 12,
            paddingRight: 12,
            borderBottom: '1px solid #2d2d2d'
          }}>
            <div style={{ width: 36, display: 'flex', justifyContent: 'flex-start' }}>
              {user?.email === 'meshackurassa2@gmail.com' && (
                <button 
                  onClick={() => setPage('admin')} 
                  style={{ 
                    width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: page === 'admin' ? '#fff' : '#666' 
                  }}
                >
                  <ShieldCheck size={16} />
                </button>
              )}
            </div>
            
            <span style={{ 
              fontWeight: 900, 
              fontSize: 10, 
              textTransform: 'uppercase', 
              letterSpacing: '0.18em',
              color: '#fff',
              whiteSpace: 'nowrap'
            }}>ViewHunt Pro</span>
            
            <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setPage('settings')} 
                style={{ 
                  width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: page === 'settings' ? '#fff' : '#666' 
                }}
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        {isDesktop && (
          <div className="sidebar-container-final">
            <Sidebar 
              user={{ ...user, ...profile }} 
              currentPage={page} 
              onNavigate={setPage} 
              trialStatus={trialStatus} 
              onSignOut={() => setUser(null)} 
            />
          </div>
        )}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          position: 'relative',
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1 }}>
            {renderPage()}
          </div>
          
          {/* Global Copyright Footer */}
          <footer style={{ 
            padding: '24px', 
            textAlign: 'center', 
            borderTop: '1px solid var(--border)',
            marginTop: 'auto'
          }}>
            <p style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em' }}>
              &copy; {new Date().getFullYear()} dapazcm. All rights reserved.
            </p>
          </footer>

          {showPaywall && page !== 'settings' && page !== 'upgrade' && (
            <Paywall user={user} onUpgrade={handleUpgrade} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav currentPage={page} onNavigate={setPage} />
      </div>
    </div>
  )
}
