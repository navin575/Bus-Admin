import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DistrictList from './pages/DistrictList';
import DistrictView from './pages/DistrictView';
import BusDetails from './pages/BusDetails';
import LiveTracking from './pages/LiveTracking';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to districts */}
        <Route index element={<Navigate to="/districts" replace />} />
        
        {/* Level 1: All Districts */}
        <Route path="districts" element={<DistrictList />} />
        
        {/* Level 2: Specific District (List of Buses) */}
        <Route path="districts/:districtId" element={<DistrictView />} />
        
        {/* Level 3: Specific Bus in a District */}
        <Route path="districts/:districtId/bus/:busId" element={<BusDetails />} />

        {/* Live Fleet Telemetry */}
        <Route path="live-tracking" element={<LiveTracking />} />

        {/* System & Operations Settings */}
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
