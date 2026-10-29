import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Search, Plus, Trash2, Bus as BusIcon } from 'lucide-react';
import { 
  getDistrictById, 
  getBusesForDistrict, 
  getRoutesList, 
  saveBus, 
  deleteBusById 
} from '../services/dataService';
import Modal from '../components/Modal';
import './Pages.css';

const DistrictView = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [district, setDistrict] = useState(null);
  const [buses, setBuses] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Add Bus Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    id: '',
    plate: '',
    capacity: 50,
    route: '',
    routeId: '',
    status: 'Active'
  });

  useEffect(() => {
    const fetchDistrictData = async () => {
      setLoading(true);
      try {
        const [districtData, busesData, routesData] = await Promise.all([
          getDistrictById(districtId),
          getBusesForDistrict(districtId),
          getRoutesList()
        ]);
        
        setDistrict(districtData);
        setBuses(busesData);
        setAvailableRoutes(routesData);
      } catch (error) {
        console.error("Error fetching district data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, [districtId]);

  const handleOpenAddModal = () => {
    const prefix = districtId ? districtId.toUpperCase().slice(0, 2) : 'TN';
    const randNum = Math.floor(100 + Math.random() * 900);
    setNewBus({
      id: `BUS-${prefix}-${randNum}`,
      plate: `TN-${Math.floor(10 + Math.random() * 89)}-N-${Math.floor(1000 + Math.random() * 9000)}`,
      capacity: 50,
      route: availableRoutes.length > 0 ? (availableRoutes[0].name || `${availableRoutes[0].start} - ${availableRoutes[0].end}`) : '',
      routeId: availableRoutes.length > 0 ? availableRoutes[0].id : '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleRouteChange = (e) => {
    const selectedRouteId = e.target.value;
    if (!selectedRouteId || selectedRouteId === 'custom') {
      setNewBus(prev => ({ ...prev, routeId: '', route: '' }));
      return;
    }

    const foundRoute = availableRoutes.find(r => r.id === selectedRouteId);
    if (foundRoute) {
      setNewBus(prev => ({
        ...prev,
        routeId: foundRoute.id,
        route: foundRoute.name || `${foundRoute.start} - ${foundRoute.end}`
      }));
    }
  };

  const handleAddBusSubmit = async (e) => {
    e.preventDefault();
    if (!newBus.plate.trim() || !newBus.route.trim()) return;

    setSubmitting(true);
    const busId = newBus.id.trim() || `BUS-${Date.now()}`;
    const busToSave = {
      id: busId,
      districtId: districtId,
      plate: newBus.plate.trim().toUpperCase(),
      capacity: Number(newBus.capacity) || 50,
      route: newBus.route.trim(),
      routeId: newBus.routeId || null,
      status: newBus.status || 'Active',
      createdAt: new Date().toISOString()
    };

    try {
      await saveBus(busToSave);
      setBuses(prev => [busToSave, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding bus:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBus = async (e, busId) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete bus ${busId}?`)) return;

    try {
      await deleteBusById(busId);
      setBuses(prev => prev.filter(b => b.id !== busId));
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };
  
  const filteredBuses = buses.filter(b => 
    (b.plate && b.plate.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (b.route && b.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.id && b.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container animate-fade-in">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
        <Link to="/districts" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>
          {district ? district.name : 'Loading...'} District
        </span>
      </div>

      <div className="page-header flex-between">
        <div>
          <h1>{district ? district.name : 'Loading...'} Fleet</h1>
          <p className="text-secondary">Select a bus to manage its specific routes and stops, or add new buses.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add Bus
        </button>
      </div>

      <div className="table-container glass-panel">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
           <div className="search-container" style={{ width: '100%', maxWidth: '400px' }}>
              <Search size={18} className="search-icon" style={{ left: '16px' }} />
              <input 
                type="text" 
                placeholder="Search buses by plate, route, or ID..." 
                className="search-input" 
                style={{ paddingLeft: '48px', background: 'var(--bg-secondary)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
             Total Fleet: <strong>{buses.length}</strong>
           </div>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading buses...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Number Plate</th>
                <th>Capacity</th>
                <th>Assigned Route</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.length > 0 ? filteredBuses.map((bus) => (
                <tr key={bus.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/districts/${districtId}/bus/${bus.id}`)}>
                  <td><span className="text-secondary" style={{fontFamily: 'monospace'}}>{bus.id}</span></td>
                  <td><strong>{bus.plate}</strong></td>
                  <td>{bus.capacity} seats</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} className="text-muted" /> {bus.route || 'Not assigned'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${bus.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/districts/${districtId}/bus/${bus.id}`);
                        }}
                      >
                        Manage
                      </button>
                      <button 
                        className="icon-btn" 
                        title="Delete Bus"
                        style={{ color: 'var(--danger)' }}
                        onClick={(e) => handleDeleteBus(e, bus.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }} className="text-secondary">
                    {searchTerm ? 'No buses found matching your search.' : 'No buses in this district yet. Click "Add Bus" above to register one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Bus Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title={`Add Bus to ${district?.name || districtId} Fleet`}
      >
        <form onSubmit={handleAddBusSubmit}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Bus ID / Fleet #</label>
              <input 
                type="text" 
                className="input-field" 
                value={newBus.id} 
                onChange={(e) => setNewBus({ ...newBus, id: e.target.value })}
                placeholder="e.g. BUS-ER-105"
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Number Plate</label>
              <input 
                type="text" 
                className="input-field" 
                value={newBus.plate} 
                onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
                placeholder="e.g. TN-33-N-1234"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Seating Capacity</label>
              <input 
                type="number" 
                min="10"
                max="120"
                className="input-field" 
                value={newBus.capacity} 
                onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Status</label>
              <select 
                className="input-field" 
                value={newBus.status} 
                onChange={(e) => setNewBus({ ...newBus, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Assigned Route</label>
            {availableRoutes.length > 0 && (
              <select 
                className="input-field" 
                style={{ marginBottom: '8px' }}
                value={newBus.routeId || (newBus.route ? 'custom' : '')}
                onChange={handleRouteChange}
              >
                <option value="">-- Choose from existing routes --</option>
                {availableRoutes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name || `${r.start} ➔ ${r.end}`}
                  </option>
                ))}
                <option value="custom">✏️ Custom Route Name...</option>
              </select>
            )}
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Erode BS - Perundurai" 
              value={newBus.route} 
              onChange={(e) => setNewBus({ ...newBus, route: e.target.value })}
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
              <BusIcon size={16} /> {submitting ? 'Adding...' : 'Add Bus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DistrictView;

