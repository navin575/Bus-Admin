import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bus } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Pages.css';

const DistrictList = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const [districtsSnap, busesSnap] = await Promise.all([
          getDocs(collection(db, "districts")),
          getDocs(collection(db, "buses"))
        ]);

        const busesData = busesSnap.docs.map(doc => doc.data());
        
        // Count actual buses registered under each district
        const busCountByDistrict = {};
        busesData.forEach(bus => {
          if (bus.districtId) {
            const dId = bus.districtId.toLowerCase();
            busCountByDistrict[dId] = (busCountByDistrict[dId] || 0) + 1;
          }
        });

        const districtsData = districtsSnap.docs.map(doc => {
          const dData = doc.data();
          const dId = doc.id.toLowerCase();
          const actualCount = busCountByDistrict[dId] ?? 0;
          return {
            id: doc.id,
            ...dData,
            activeBuses: actualCount
          };
        });

        setDistricts(districtsData);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Fleet Operations</h1>
        <p className="text-secondary">Select a district to manage its buses, routes, and stops.</p>
      </div>

      {loading ? (
        <div style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading districts...</div>
      ) : (
        <div className="kpi-grid" style={{ marginTop: '20px' }}>
          {districts.map(district => (
            <Link key={district.id} to={`/districts/${district.id}`} style={{ textDecoration: 'none' }}>
              <div className="kpi-card glass-panel" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <MapPin size={24} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{district.name}</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bus size={16} className="text-secondary" />
                    <span className="text-secondary"><strong>{district.activeBuses}</strong> Buses</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-success">{district.routes} Routes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistrictList;
