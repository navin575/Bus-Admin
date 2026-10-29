import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  Bus, 
  Navigation, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { getDistrictsList } from '../services/dataService';
import { DEFAULT_BUSES } from '../data/defaultFleetData';
import './Pages.css';

const LiveTracking = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      try {
        const distList = await getDistrictsList();
        setDistricts(distList);

        const cachedBuses = JSON.parse(localStorage.getItem('tnstc_buses') || 'null') || DEFAULT_BUSES;
        setBuses(cachedBuses);
      } catch (err) {
        console.error("Error fetching live tracking data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  const filteredBuses = buses.filter(bus => {
    const matchesDistrict = selectedDistrict === 'all' || bus.districtId?.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSearch = 
      (bus.plate && bus.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bus.route && bus.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bus.id && bus.id.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  const activeCount = buses.filter(b => b.status === 'Active').length;
  const maintenanceCount = buses.filter(b => b.status === 'Maintenance').length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={28} color="var(--accent-primary)" /> Live Fleet Telemetry
          </h1>
          <p className="text-secondary">Real-time status, route alignment, and telemetry across all Tamil Nadu district fleets.</p>
        </div>

        <div className="badge badge-success" style={{ padding: '8px 14px', fontSize: '0.875rem', gap: '8px' }}>
          <Radio size={16} /> Live GPS Stream Active
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel">
          <h3>Total Tracked Buses</h3>
          <div className="kpi-value">{buses.length}</div>
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Registered across all districts</span>
        </div>
        <div className="kpi-card glass-panel">
          <h3>Active On Road</h3>
          <div className="kpi-value text-success">{activeCount}</div>
          <span className="text-success" style={{ fontSize: '0.8rem' }}>Transmitting telemetry</span>
        </div>
        <div className="kpi-card glass-panel">
          <h3>In Maintenance</h3>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>{maintenanceCount}</div>
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Under routine depot service</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-container glass-panel">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
            <div className="search-container" style={{ width: '100%', maxWidth: '360px' }}>
              <Search size={18} className="search-icon" style={{ left: '16px' }} />
              <input 
                type="text" 
                placeholder="Search live buses by plate or route..." 
                className="search-input" 
                style={{ paddingLeft: '48px', background: 'var(--bg-secondary)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="input-field" 
              style={{ width: 'auto', minWidth: '180px' }}
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">All Districts ({districts.length})</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name} District</option>
              ))}
            </select>
          </div>

          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Showing: <strong>{filteredBuses.length}</strong> vehicles
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Connecting to live telemetry feed...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Registration</th>
                <th>District</th>
                <th>Assigned Route</th>
                <th>Capacity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Telemetry Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.length > 0 ? filteredBuses.map((bus) => (
                <tr 
                  key={bus.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/districts/${bus.districtId}/bus/${bus.id}`)}
                >
                  <td><span className="text-secondary" style={{ fontFamily: 'monospace' }}>{bus.id}</span></td>
                  <td><strong>{bus.plate}</strong></td>
                  <td>
                    <span style={{ textTransform: 'capitalize' }}>
                      {bus.districtId || 'General'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Navigation size={14} className="text-muted" />
                      <span>{bus.route || 'Standby'}</span>
                    </div>
                  </td>
                  <td>{bus.capacity} seats</td>
                  <td>
                    <span className={`badge ${bus.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      ● {bus.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/districts/${bus.districtId}/bus/${bus.id}`);
                      }}
                    >
                      Inspect Stops <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }} className="text-secondary">
                    No active buses found matching the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;
