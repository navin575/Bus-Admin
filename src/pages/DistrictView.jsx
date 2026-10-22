import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Search } from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Pages.css';

const DistrictView = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [district, setDistrict] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        // Fetch District Details
        const districtRef = doc(db, "districts", districtId);
        const districtSnap = await getDoc(districtRef);
        
        if (districtSnap.exists()) {
          setDistrict({ id: districtSnap.id, ...districtSnap.data() });
        } else {
          setDistrict({ name: districtId }); // Fallback
        }

        // Fetch Buses for this District
        const q = query(collection(db, "buses"), where("districtId", "==", districtId));
        const querySnapshot = await getDocs(q);
        const busesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBuses(busesData);

      } catch (error) {
        console.error("Error fetching district data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, [districtId]);
  
  const filteredBuses = buses.filter(b => 
    b.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.route.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-secondary">Select a bus to manage its specific routes and stops.</p>
        </div>
      </div>

      <div className="table-container glass-panel">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div className="search-container" style={{ width: '100%', maxWidth: '400px' }}>
              <Search size={18} className="search-icon" style={{ left: '16px' }} />
              <input 
                type="text" 
                placeholder="Search buses by plate or route..." 
                className="search-input" 
                style={{ paddingLeft: '48px', background: 'var(--bg-secondary)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                <th>Action</th>
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
                      <MapPin size={14} className="text-muted" /> {bus.route}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${bus.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                      Manage
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }} className="text-secondary">
                    No buses found matching your search.
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

export default DistrictView;
