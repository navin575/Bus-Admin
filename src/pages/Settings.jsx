import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Database, 
  Shield, 
  Bell, 
  MapPin, 
  Check, 
  RefreshCw, 
  Radio, 
  UserCheck, 
  Sliders
} from 'lucide-react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Pages.css';

const Settings = () => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tnstc_theme') || 'light';
  });

  // Settings form state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('tnstc_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      portalName: 'TNSTC Smart Transit Operations',
      operatingZone: 'West Zone (Salem, Erode, Coimbatore, Tiruppur)',
      refreshRate: '10',
      language: 'en',
      proximityRadius: 75,
      speedLimit: 60,
      emergencyAlerts: true,
      audioPings: false,
      adminName: 'Navin M.',
      adminEmail: 'navinmohan575@gmail.com',
      adminRole: 'Chief Fleet Superintendent'
    };
  });

  // DB Statistics
  const [dbStats, setDbStats] = useState({ districts: 0, buses: 0, routes: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [reseedMessage, setReseedMessage] = useState('');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tnstc_theme', theme);
  }, [theme]);

  // Fetch Firestore Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [districtsSnap, busesSnap, routesSnap] = await Promise.all([
          getDocs(collection(db, "districts")),
          getDocs(collection(db, "buses")),
          getDocs(collection(db, "routes"))
        ]);
        setDbStats({
          districts: districtsSnap.size,
          buses: busesSnap.size,
          routes: routesSnap.size
        });
      } catch (err) {
        console.error("Error reading database stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('tnstc_settings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleThemeToggle = (newTheme) => {
    setTheme(newTheme);
  };

  const handleReseedData = async () => {
    if (!window.confirm("Are you sure you want to re-seed demo districts and buses? This will update initial records.")) return;
    setIsReseeding(true);
    setReseedMessage('');

    try {
      const defaultDistricts = [
        { id: 'erode', name: 'Erode', activeBuses: 124, routes: 45 },
        { id: 'salem', name: 'Salem', activeBuses: 210, routes: 82 },
        { id: 'coimbatore', name: 'Coimbatore', activeBuses: 350, routes: 115 },
        { id: 'tiruppur', name: 'Tiruppur', activeBuses: 95, routes: 34 },
      ];

      for (const d of defaultDistricts) {
        await setDoc(doc(db, "districts", d.id), d);
      }

      setReseedMessage('✅ Demo districts and routes verified in Firebase Firestore!');
      // Update stats
      const [districtsSnap, busesSnap, routesSnap] = await Promise.all([
        getDocs(collection(db, "districts")),
        getDocs(collection(db, "buses")),
        getDocs(collection(db, "routes"))
      ]);
      setDbStats({
        districts: districtsSnap.size,
        buses: busesSnap.size,
        routes: routesSnap.size
      });
    } catch (err) {
      console.error("Reseed failed:", err);
      setReseedMessage('❌ Error syncing data. Please check Firebase permissions.');
    } finally {
      setIsReseeding(false);
      setTimeout(() => setReseedMessage(''), 5000);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={28} color="var(--accent-primary)" /> System Settings
          </h1>
          <p className="text-secondary">Configure fleet operations, appearance, GPS telemetry thresholds, and database connection.</p>
        </div>

        {isSaved && (
          <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.875rem', gap: '6px' }}>
            <Check size={16} /> Preferences Saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* 1. Appearance & Theme */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--accent-primary)" /> Appearance & Display
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Interface Theme</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleThemeToggle('light')}
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  <Sun size={18} /> Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeToggle('dark')}
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  <Moon size={18} /> Dark Mode
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">System Language</label>
              <select 
                className="input-field" 
                value={settings.language} 
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="en">English (India)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Operations & Fleet General */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="var(--accent-primary)" /> Transit Operations & Rules
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Portal / Organization Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={settings.portalName} 
                onChange={(e) => setSettings({ ...settings, portalName: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Operating Zone / Division</label>
              <input 
                type="text" 
                className="input-field" 
                value={settings.operatingZone} 
                onChange={(e) => setSettings({ ...settings, operatingZone: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Stop Proximity Geofence Radius (meters)</label>
              <input 
                type="number" 
                min="20"
                max="500"
                className="input-field" 
                value={settings.proximityRadius} 
                onChange={(e) => setSettings({ ...settings, proximityRadius: Number(e.target.value) })}
                required
              />
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                Distance inside which the passenger/conductor app registers the bus has reached the bus stop.
              </span>
            </div>

            <div className="input-group">
              <label className="input-label">Fleet Speed Warning Threshold (km/h)</label>
              <input 
                type="number" 
                min="30"
                max="120"
                className="input-field" 
                value={settings.speedLimit} 
                onChange={(e) => setSettings({ ...settings, speedLimit: Number(e.target.value) })}
                required
              />
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                Triggers visual warning badges on driver and admin dashboards.
              </span>
            </div>

            <div className="input-group">
              <label className="input-label">Dashboard Telemetry Refresh Rate</label>
              <select 
                className="input-field" 
                value={settings.refreshRate} 
                onChange={(e) => setSettings({ ...settings, refreshRate: e.target.value })}
              >
                <option value="5">Every 5 Seconds (Real-time)</option>
                <option value="10">Every 10 Seconds (Recommended)</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 60 Seconds</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={settings.emergencyAlerts} 
                  onChange={(e) => setSettings({ ...settings, emergencyAlerts: e.target.checked })} 
                />
                <span>Enable SOS Emergency Push Alerts</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={settings.audioPings} 
                  onChange={(e) => setSettings({ ...settings, audioPings: e.target.checked })} 
                />
                <span>Audio chime on vehicle route deviation</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Database & Firebase Connection */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--accent-primary)" /> Cloud Firestore Connection
            </h2>
            <span className="badge badge-success">● Connected: tnstc-smart-transit</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Districts In DB</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{loadingStats ? '...' : dbStats.districts}</div>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Registered Buses</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{loadingStats ? '...' : dbStats.buses}</div>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Mapped Routes</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{loadingStats ? '...' : dbStats.routes}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReseedData}
              disabled={isReseeding}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} className={isReseeding ? 'animate-spin' : ''} />
              {isReseeding ? 'Syncing...' : 'Verify / Sync Default Districts'}
            </button>
            {reseedMessage && (
              <span style={{ fontSize: '0.875rem', color: reseedMessage.startsWith('✅') ? 'var(--success)' : 'var(--danger)' }}>
                {reseedMessage}
              </span>
            )}
          </div>
        </div>

        {/* 4. Administrator Profile */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--accent-primary)" /> Administrator Credentials
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Administrator Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={settings.adminName} 
                onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Official Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={settings.adminEmail} 
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Role & Security Clearance</label>
              <input 
                type="text" 
                className="input-field" 
                value={settings.adminRole} 
                onChange={(e) => setSettings({ ...settings, adminRole: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', marginBottom: '40px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={18} /> Save Settings
          </button>
        </div>

      </form>
    </div>
  );
};

export default Settings;
