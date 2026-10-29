import { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Search, 
  Plus, 
  ChevronRight, 
  Bus, 
  Map, 
  Check, 
  Layers
} from 'lucide-react';
import { getRoutesList, saveRoute } from '../services/dataService';
import { DEFAULT_BUSES } from '../data/defaultFleetData';
import Modal from '../components/Modal';
import './Pages.css';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTown, setSelectedTown] = useState('all');

  // Modal State for adding a new Route
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRoute, setNewRoute] = useState({
    id: '',
    name: '',
    districtId: 'tiruppur',
    start: '',
    end: '',
    intermediateStops: ''
  });

  // Selected route for viewing stops
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    const fetchRoutesAndBuses = async () => {
      setLoading(true);
      try {
        const routeList = await getRoutesList();
        setRoutes(routeList);
        // Try reading local/cached buses
        const cachedBuses = JSON.parse(localStorage.getItem('tnstc_buses') || 'null') || DEFAULT_BUSES;
        setBuses(cachedBuses);
      } catch (err) {
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesAndBuses();
  }, []);

  const handleOpenAddModal = () => {
    const randNum = Math.floor(100 + Math.random() * 900);
    setNewRoute({
      id: `ROUTE-${randNum}`,
      name: '',
      districtId: 'tiruppur',
      start: '',
      end: '',
      intermediateStops: ''
    });
    setIsAddModalOpen(true);
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.name.trim() || !newRoute.start.trim() || !newRoute.end.trim()) return;

    setSubmitting(true);
    const routeId = newRoute.id.trim() || `ROUTE-${Date.now()}`;

    // Parse intermediate stops
    const intermediateList = newRoute.intermediateStops
      ? newRoute.intermediateStops.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const stops = [
      { id: `ST-${Date.now()}-1`, name: newRoute.start.trim(), lat: '11.0000', lng: '77.5000', isKeyStop: true },
      ...intermediateList.map((stopName, idx) => ({
        id: `ST-${Date.now()}-${idx + 2}`,
        name: stopName,
        lat: (11.0000 + (idx + 1) * 0.02).toFixed(4),
        lng: (77.5000 + (idx + 1) * 0.02).toFixed(4),
        isKeyStop: false
      })),
      { id: `ST-${Date.now()}-end`, name: newRoute.end.trim(), lat: '11.1000', lng: '77.6000', isKeyStop: true }
    ];

    const routeData = {
      id: routeId,
      name: newRoute.name.trim(),
      districtId: newRoute.districtId,
      start: newRoute.start.trim(),
      end: newRoute.end.trim(),
      towns: [newRoute.start.trim(), ...intermediateList, newRoute.end.trim()],
      stops: stops
    };

    try {
      await saveRoute(routeData);
      setRoutes(prev => [routeData, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error saving route:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Extract unique towns across routes
  const townSet = new Set(['Kangayam', 'Dharapuram', 'Sathyamangalam', 'Pollachi', 'Mettupalayam', 'Erode', 'Tiruppur', 'Coimbatore', 'Salem']);
  routes.forEach(r => {
    if (r.towns) r.towns.forEach(t => townSet.add(t));
    if (r.start) townSet.add(r.start.replace(/Bus Stand|Central|BS/gi, '').trim());
    if (r.end) townSet.add(r.end.replace(/Bus Stand|Central|BS/gi, '').trim());
  });
  const popularTowns = Array.from(townSet).filter(t => t.length > 2).slice(0, 10);

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (route.name && route.name.toLowerCase().includes(term)) ||
      (route.start && route.start.toLowerCase().includes(term)) ||
      (route.end && route.end.toLowerCase().includes(term)) ||
      (route.towns && route.towns.some(t => t.toLowerCase().includes(term)));

    const matchesTown = selectedTown === 'all' || 
      (route.name && route.name.toLowerCase().includes(selectedTown.toLowerCase())) ||
      (route.start && route.start.toLowerCase().includes(selectedTown.toLowerCase())) ||
      (route.end && route.end.toLowerCase().includes(selectedTown.toLowerCase())) ||
      (route.towns && route.towns.some(t => t.toLowerCase().includes(selectedTown.toLowerCase())));

    return matchesSearch && matchesTown;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={28} color="var(--accent-primary)" /> Transit Route Network
          </h1>
          <p className="text-secondary">
            Manage regional transit corridors connecting towns like Kangayam, Dharapuram, Sathyamangalam, Pollachi, and major district hubs.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add New Route
        </button>
      </div>

      {/* Town Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button 
          className={`badge ${selectedTown === 'all' ? 'badge-success' : ''}`}
          style={{ 
            cursor: 'pointer', 
            padding: '8px 16px', 
            fontSize: '0.85rem',
            background: selectedTown === 'all' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: selectedTown === 'all' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
          onClick={() => setSelectedTown('all')}
        >
          All Corridors ({routes.length})
        </button>
        {popularTowns.map(town => (
          <button 
            key={town}
            className="badge"
            style={{ 
              cursor: 'pointer', 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              background: selectedTown.toLowerCase() === town.toLowerCase() ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: selectedTown.toLowerCase() === town.toLowerCase() ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)'
            }}
            onClick={() => setSelectedTown(town)}
          >
            📍 {town}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="table-container glass-panel">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-container" style={{ width: '100%', maxWidth: '420px' }}>
            <Search size={18} className="search-icon" style={{ left: '16px' }} />
            <input 
              type="text" 
              placeholder="Search by town, stop name (e.g. Kangayam), or route..." 
              className="search-input" 
              style={{ paddingLeft: '48px', background: 'var(--bg-secondary)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Active Corridors: <strong>{filteredRoutes.length}</strong>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading regional transit routes...
          </div>
        ) : (
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredRoutes.length > 0 ? filteredRoutes.map(route => {
              const assignedBuses = buses.filter(b => b.routeId === route.id || (b.route && b.route.toLowerCase().includes(route.name.toLowerCase())));
              return (
                <div 
                  key={route.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '20px', 
                    borderRadius: 'var(--border-radius-md)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                        {route.districtId || 'Regional'}
                      </span>
                      <span className="text-secondary" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {route.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                      {route.name}
                    </h3>

                    {/* Start ➔ End Destination Card */}
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Origin</div>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{route.start}</div>
                      </div>
                      <ChevronRight size={16} className="text-muted" />
                      <div style={{ flex: 1 }}>
                        <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Destination</div>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{route.end}</div>
                      </div>
                    </div>

                    {/* Intermediate Towns Chips */}
                    {route.towns && route.towns.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {route.towns.map((town, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              background: town.toLowerCase().includes('kangayam') ? 'rgba(30, 64, 175, 0.15)' : 'var(--bg-secondary)', 
                              color: town.toLowerCase().includes('kangayam') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              fontWeight: town.toLowerCase().includes('kangayam') ? '600' : 'normal',
                              fontSize: '0.75rem', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)' 
                            }}
                          >
                            {town}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} color="var(--accent-primary)" />
                      <span>{route.stops ? route.stops.length : 0} Sequence Stops</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <Bus size={14} />
                      <span><strong>{assignedBuses.length}</strong> Buses Assigned</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No transit routes found matching "{searchTerm || selectedTown}". Click "Add New Route" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Route Stops Modal */}
      <Modal 
        isOpen={!!selectedRoute} 
        onClose={() => setSelectedRoute(null)} 
        title={selectedRoute ? `Route Stops: ${selectedRoute.name}` : ''}
      >
        {selectedRoute && (
          <div>
            <div style={{ marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Origin & Destination</span>
                <span className="badge badge-success">{selectedRoute.districtId || 'Regional'}</span>
              </div>
              <strong>{selectedRoute.start} ➔ {selectedRoute.end}</strong>
            </div>

            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Stops Sequence ({selectedRoute.stops?.length || 0})
            </h4>

            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedRoute.stops && selectedRoute.stops.length > 0 ? (
                selectedRoute.stops.map((stop, idx) => (
                  <div 
                    key={stop.id || idx} 
                    style={{ 
                      padding: '10px 14px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-color)' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: 'var(--bg-tertiary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold' 
                      }}>
                        {idx + 1}
                      </span>
                      <strong>{stop.name}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {stop.lat}, {stop.lng}
                      </span>
                      {stop.isKeyStop && (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Terminal</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No stops configured yet for this route.
                </div>
              )}
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedRoute(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Route Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Create New Regional Route"
      >
        <form onSubmit={handleCreateRoute}>
          <div className="input-group">
            <label className="input-label">Route Code / ID</label>
            <input 
              type="text" 
              className="input-field" 
              value={newRoute.id} 
              onChange={(e) => setNewRoute({ ...newRoute, id: e.target.value })}
              placeholder="e.g. ROUTE-KGM-101"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Route Display Title</label>
            <input 
              type="text" 
              className="input-field" 
              value={newRoute.name} 
              onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
              placeholder="e.g. Route 24: Tiruppur - Kangayam"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Managing District Division</label>
            <select 
              className="input-field"
              value={newRoute.districtId}
              onChange={(e) => setNewRoute({ ...newRoute, districtId: e.target.value })}
            >
              <option value="tiruppur">Tiruppur (Kangayam / Dharapuram)</option>
              <option value="erode">Erode (Bhavani / Sathyamangalam)</option>
              <option value="coimbatore">Coimbatore (Pollachi / Mettupalayam)</option>
              <option value="salem">Salem (Omalur / Mettur Dam)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Start Point (Origin)</label>
              <input 
                type="text" 
                className="input-field" 
                value={newRoute.start} 
                onChange={(e) => setNewRoute({ ...newRoute, start: e.target.value })}
                placeholder="e.g. Tiruppur Old Bus Stand"
                required
              />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">End Point (Destination)</label>
              <input 
                type="text" 
                className="input-field" 
                value={newRoute.end} 
                onChange={(e) => setNewRoute({ ...newRoute, end: e.target.value })}
                placeholder="e.g. Kangayam Bus Stand"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Intermediate Towns / Stops (comma-separated)</label>
            <input 
              type="text" 
              className="input-field" 
              value={newRoute.intermediateStops} 
              onChange={(e) => setNewRoute({ ...newRoute, intermediateStops: e.target.value })}
              placeholder="e.g. Nallur, Kovilvazhi, Chengapalli Pirivu"
            />
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
              These intermediate stops will automatically be formatted into geofence sequence points.
            </span>
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
              <Check size={16} /> {submitting ? 'Creating...' : 'Create Route'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default RouteList;
