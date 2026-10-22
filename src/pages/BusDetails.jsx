import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Navigation, Map, Edit2, Trash2, Plus, GripVertical, Bus } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Modal from '../components/Modal';
import './Pages.css';

const BusDetails = () => {
  const { districtId, busId } = useParams();
  
  const [busData, setBusData] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Bus
        const busRef = doc(db, "buses", busId);
        const busSnap = await getDoc(busRef);
        
        if (busSnap.exists()) {
          const bus = { id: busSnap.id, ...busSnap.data() };
          setBusData(bus);
          
          // 2. Fetch Route (if assigned)
          if (bus.routeId) {
            const routeRef = doc(db, "routes", bus.routeId);
            const routeSnap = await getDoc(routeRef);
            if (routeSnap.exists()) {
               setRouteData({ id: routeSnap.id, ...routeSnap.data() });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [busId]);

  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setIsStopModalOpen(true);
  };

  const handleSaveStop = async (e) => {
    e.preventDefault();
    if (!routeData) return;

    let updatedStops;
    if (editingStop.isNew) {
      const newStop = { ...editingStop, id: `ST-${Date.now()}` };
      delete newStop.isNew;
      updatedStops = [...routeData.stops, newStop];
    } else {
      updatedStops = routeData.stops.map(s => s.id === editingStop.id ? editingStop : s);
    }

    // Optimistic UI update
    setRouteData({ ...routeData, stops: updatedStops });
    setIsStopModalOpen(false);

    // Save to Firestore
    try {
      await updateDoc(doc(db, "routes", routeData.id), { stops: updatedStops });
    } catch (error) {
      console.error("Error saving stop to Firebase:", error);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!routeData) return;
    const updatedStops = routeData.stops.filter(s => s.id !== stopId);
    
    // Optimistic UI update
    setRouteData({ ...routeData, stops: updatedStops });

    // Save to Firestore
    try {
      await updateDoc(doc(db, "routes", routeData.id), { stops: updatedStops });
    } catch (error) {
      console.error("Error deleting stop:", error);
    }
  };

  if (loading) {
    return <div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Loading bus data from Firebase...</div>;
  }

  if (!busData) {
    return <div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Bus not found!</div>;
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
        <Link to="/districts" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </Link>
        <ChevronRight size={14} />
        <Link to={`/districts/${districtId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <span style={{ textTransform: 'capitalize' }}>{districtId} District</span>
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{busData.plate}</span>
      </div>

      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>Bus Configuration: {busData.plate}</h1>
          <p className="text-secondary">Manage route, stops, and settings exclusively for this bus.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div className={`badge ${busData.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              ● {busData.status}
           </div>
        </div>
      </div>

      {/* Bus Info & Route Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Bus Info Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
              <Bus size={20} /> Bus Details
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Bus ID / Tracker ID</label>
                <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', color: 'var(--text-primary)' }}>{busData.id}</div>
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Number Plate</label>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{busData.plate}</div>
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Seating Capacity</label>
                <div style={{ fontSize: '1.125rem' }}>{busData.capacity} Seats</div>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '8px' }}>Edit Details</button>
           </div>
        </div>

        {/* Route Info Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
           <div className="flex-between" style={{ marginBottom: '16px' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                <Navigation size={20} /> Assigned Route
             </h3>
             <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>Change Route</button>
           </div>
           
           {routeData ? (
             <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>{routeData.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>START DESTINATION</div>
                    <strong>{routeData.start}</strong>
                  </div>
                  <ChevronRight className="text-muted" />
                  <div style={{ flex: 1, padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>END DESTINATION</div>
                    <strong>{routeData.end}</strong>
                  </div>
                </div>
             </div>
           ) : (
             <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>No route assigned to this bus.</div>
           )}
        </div>

      </div>

      {/* Stops Management */}
      <div className="glass-panel" style={{ marginTop: '8px' }}>
        <div className="flex-between" style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
              <MapPin size={20} /> Stops & Geo-fencing Sequence
            </h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '4px' }}>
              These stops belong to Route: <strong>{routeData?.name}</strong>. The Ticket App will use these coordinates.
            </p>
          </div>
          <button className="btn btn-primary" disabled={!routeData} onClick={() => { setEditingStop({ isNew: true, name: '', lat: '', lng: '', isKeyStop: false }); setIsStopModalOpen(true); }}>
            <Plus size={18} /> Add Stop to Route
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Sequence</th>
              <th>Stop Name</th>
              <th>GPS Coordinates</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routeData?.stops && routeData.stops.length > 0 ? routeData.stops.map((stop, index) => (
              <tr key={stop.id}>
                <td style={{ color: 'var(--text-muted)', cursor: 'grab' }}><GripVertical size={16} /></td>
                <td><div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>{index + 1}</div></td>
                <td><strong>{stop.name}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Map size={14} className="text-secondary" />
                    <span className="text-secondary" style={{fontFamily: 'monospace'}}>{stop.lat}, {stop.lng}</span>
                  </div>
                </td>
                <td>
                  {stop.isKeyStop ? <span className="badge badge-success">Major Terminal</span> : <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Normal Stop</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" title="Edit" onClick={() => handleEditStop(stop)}><Edit2 size={16} /></button>
                    <button className="icon-btn" style={{color: 'var(--danger)'}} title="Remove from sequence" onClick={() => handleDeleteStop(stop.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }} className="text-secondary">
                  No stops found for this route.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stop Edit Modal */}
      <Modal isOpen={isStopModalOpen} onClose={() => setIsStopModalOpen(false)} title={editingStop?.isNew ? "Add Stop to Sequence" : "Edit Stop Details"}>
        <form onSubmit={handleSaveStop}>
          <div className="input-group">
            <label className="input-label">Stop Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={editingStop?.name || ''} 
              onChange={(e) => setEditingStop({...editingStop, name: e.target.value})}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Latitude</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingStop?.lat || ''} 
                onChange={(e) => setEditingStop({...editingStop, lat: e.target.value})}
                placeholder="e.g. 11.3410"
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Longitude</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingStop?.lng || ''} 
                onChange={(e) => setEditingStop({...editingStop, lng: e.target.value})}
                placeholder="e.g. 77.7172"
                required
              />
            </div>
          </div>
          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input 
              type="checkbox" 
              id="keyStop"
              checked={editingStop?.isKeyStop || false}
              onChange={(e) => setEditingStop({...editingStop, isKeyStop: e.target.checked})}
            />
            <label htmlFor="keyStop" className="input-label" style={{ margin: 0, cursor: 'pointer' }}>Mark as Major Terminal</label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsStopModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Stop</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default BusDetails;
