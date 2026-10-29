import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bus, Plus, Search, Check, RefreshCw } from 'lucide-react';
import { getDistrictsList, saveDistrict } from '../services/dataService';
import Modal from '../components/Modal';
import './Pages.css';

const DistrictList = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  // Add District Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDistrict, setNewDistrict] = useState({
    id: '',
    name: '',
    zone: 'West Zone',
    routes: 5
  });

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const data = await getDistrictsList();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleOpenAddModal = () => {
    setNewDistrict({
      id: '',
      name: '',
      zone: 'West Zone',
      routes: 5
    });
    setIsAddModalOpen(true);
  };

  const handleCreateDistrict = async (e) => {
    e.preventDefault();
    if (!newDistrict.name.trim()) return;

    setSubmitting(true);
    const dId = newDistrict.id.trim() 
      ? newDistrict.id.trim().toLowerCase().replace(/\s+/g, '-') 
      : newDistrict.name.trim().toLowerCase().replace(/\s+/g, '-');

    const districtData = {
      id: dId,
      name: newDistrict.name.trim(),
      zone: newDistrict.zone,
      routes: Number(newDistrict.routes) || 5,
      activeBuses: 0
    };

    try {
      await saveDistrict(districtData);
      setDistricts(prev => {
        const updated = prev.filter(d => d.id !== dId);
        return [...updated, districtData].sort((a, b) => a.name.localeCompare(b.name));
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding district:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const zones = ['All Zones', 'West Zone', 'South Zone', 'Central Zone', 'North Zone'];

  const filteredDistricts = districts.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.zone && d.zone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesZone = selectedZone === 'all' || 
                        selectedZone === 'All Zones' || 
                        d.zone?.toLowerCase() === selectedZone.toLowerCase();
    return matchesSearch && matchesZone;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>Fleet Operations & Districts</h1>
          <p className="text-secondary">Select a district to manage its buses, routes, and stops, or add new administrative divisions.</p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add District
        </button>
      </div>

      {/* Zone Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {zones.map(z => (
          <button
            key={z}
            className="badge"
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '0.85rem',
              background: (selectedZone === z || (selectedZone === 'all' && z === 'All Zones')) ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: (selectedZone === z || (selectedZone === 'all' && z === 'All Zones')) ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)'
            }}
            onClick={() => setSelectedZone(z === 'All Zones' ? 'all' : z)}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-container" style={{ width: '100%', maxWidth: '400px' }}>
        <Search size={18} className="search-icon" style={{ left: '16px' }} />
        <input 
          type="text" 
          placeholder="Search districts (e.g. Chennai, Madurai, Erode)..." 
          className="search-input" 
          style={{ paddingLeft: '48px', background: 'var(--bg-secondary)' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading Tamil Nadu districts...</div>
      ) : (
        <div className="kpi-grid" style={{ marginTop: '8px' }}>
          {filteredDistricts.length > 0 ? filteredDistricts.map(district => (
            <Link key={district.id} to={`/districts/${district.id}`} style={{ textDecoration: 'none' }}>
              <div className="kpi-card glass-panel" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={24} color="var(--accent-primary)" />
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{district.name}</h2>
                  </div>
                  {district.zone && (
                    <span className="badge" style={{ fontSize: '0.7rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {district.zone}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bus size={16} className="text-secondary" />
                    <span className="text-secondary"><strong>{district.activeBuses}</strong> Buses</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-success">{district.routes || 0} Routes</span>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No districts found matching "{searchTerm}". Click "Add District" to create one.
            </div>
          )}
        </div>
      )}

      {/* Add District Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New District"
      >
        <form onSubmit={handleCreateDistrict}>
          <div className="input-group">
            <label className="input-label">District Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={newDistrict.name} 
              onChange={(e) => {
                const val = e.target.value;
                setNewDistrict(prev => ({
                  ...prev,
                  name: val,
                  id: val.toLowerCase().replace(/\s+/g, '-')
                }));
              }}
              placeholder="e.g. Cuddalore or Tiruvannamalai"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">District ID / Code (Slug)</label>
            <input 
              type="text" 
              className="input-field" 
              value={newDistrict.id} 
              onChange={(e) => setNewDistrict({ ...newDistrict, id: e.target.value })}
              placeholder="e.g. cuddalore"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">TNSTC Operating Zone</label>
            <select 
              className="input-field"
              value={newDistrict.zone}
              onChange={(e) => setNewDistrict({ ...newDistrict, zone: e.target.value })}
            >
              <option value="West Zone">West Zone (Coimbatore / Erode / Salem)</option>
              <option value="South Zone">South Zone (Madurai / Tirunelveli)</option>
              <option value="Central Zone">Central Zone (Trichy / Kumbakonam)</option>
              <option value="North Zone">North Zone (Chennai / Villupuram / Vellore)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Initial Routes Count</label>
            <input 
              type="number" 
              min="1"
              max="200"
              className="input-field" 
              value={newDistrict.routes} 
              onChange={(e) => setNewDistrict({ ...newDistrict, routes: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Check size={16} /> {submitting ? 'Adding...' : 'Add District'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default DistrictList;

