import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { DEFAULT_DISTRICTS, DEFAULT_BUSES, DEFAULT_ROUTES } from '../data/defaultFleetData.js';

const STORAGE_KEYS = {
  DISTRICTS: 'tnstc_districts',
  BUSES: 'tnstc_buses',
  ROUTES: 'tnstc_routes',
  PERMISSION_STATE: 'tnstc_firebase_permission_denied'
};

// Internal status tracker
let firebaseStatus = {
  tested: false,
  connected: false,
  permissionDenied: false,
  error: null
};

const listeners = new Set();
function notifyListeners() {
  listeners.forEach(cb => {
    try { cb(firebaseStatus); } catch (e) { console.error(e); }
  });
}

export function subscribeFirebaseStatus(callback) {
  listeners.add(callback);
  callback(firebaseStatus);
  return () => listeners.delete(callback);
}

export function getFirebaseStatus() {
  return firebaseStatus;
}

// Memory fallback store if localStorage is unavailable
const memoryStore = {};

// Local Storage Helpers
function getLocal(key, defaultValue) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val) return JSON.parse(val);
    } else if (memoryStore[key]) {
      return memoryStore[key];
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
  }
  return defaultValue;
}

function setLocal(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
    memoryStore[key] = value;
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// Initialize LocalStorage with seed data if not present
function ensureLocalInitialized() {
  if (typeof localStorage !== 'undefined') {
    if (!localStorage.getItem(STORAGE_KEYS.DISTRICTS)) {
      setLocal(STORAGE_KEYS.DISTRICTS, DEFAULT_DISTRICTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUSES)) {
      setLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
      setLocal(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);
    }
  } else {
    if (!memoryStore[STORAGE_KEYS.DISTRICTS]) memoryStore[STORAGE_KEYS.DISTRICTS] = DEFAULT_DISTRICTS;
    if (!memoryStore[STORAGE_KEYS.BUSES]) memoryStore[STORAGE_KEYS.BUSES] = DEFAULT_BUSES;
    if (!memoryStore[STORAGE_KEYS.ROUTES]) memoryStore[STORAGE_KEYS.ROUTES] = DEFAULT_ROUTES;
  }
}

// Call on startup
ensureLocalInitialized();

// Helper to calculate bus counts by district
function computeDistrictCounts(districts, buses) {
  const countMap = {};
  buses.forEach(b => {
    if (b.districtId) {
      const dId = b.districtId.toLowerCase();
      countMap[dId] = (countMap[dId] || 0) + 1;
    }
  });

  return districts.map(d => {
    const dId = d.id.toLowerCase();
    const actualBuses = countMap[dId] ?? (d.activeBuses || 0);
    return {
      ...d,
      activeBuses: actualBuses
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch all districts with fallback and cloud synchronization
 */
export async function getDistrictsList() {
  ensureLocalInitialized();
  let localDistricts = getLocal(STORAGE_KEYS.DISTRICTS, DEFAULT_DISTRICTS);
  let localBuses = getLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);

  try {
    const [districtsSnap, busesSnap] = await Promise.all([
      getDocs(collection(db, "districts")),
      getDocs(collection(db, "buses"))
    ]);

    // If Firestore returned documents, use them and cache locally
    if (districtsSnap.size > 0) {
      const cloudDistricts = districtsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const cloudBuses = busesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setLocal(STORAGE_KEYS.DISTRICTS, cloudDistricts);
      if (cloudBuses.length > 0) {
        setLocal(STORAGE_KEYS.BUSES, cloudBuses);
        localBuses = cloudBuses;
      }

      firebaseStatus = {
        tested: true,
        connected: true,
        permissionDenied: false,
        error: null
      };
      notifyListeners();

      return computeDistrictCounts(cloudDistricts, localBuses);
    } else {
      // Cloud is accessible but empty, let's return local districts
      firebaseStatus = { tested: true, connected: true, permissionDenied: false, error: null };
      notifyListeners();
      return computeDistrictCounts(localDistricts, localBuses);
    }
  } catch (error) {
    console.warn("Firestore fetch failed, falling back to local dataset:", error.message);
    const isPermissionError = error.code === 'permission-denied' || error.message?.includes('insufficient permissions');
    
    firebaseStatus = {
      tested: true,
      connected: false,
      permissionDenied: isPermissionError,
      error: error.message
    };
    notifyListeners();

    // Fall back safely to full local data
    return computeDistrictCounts(localDistricts, localBuses);
  }
}

/**
 * Fetch a single district by ID
 */
export async function getDistrictById(districtId) {
  ensureLocalInitialized();
  const lowerId = districtId?.toLowerCase();

  try {
    const docRef = doc(db, "districts", lowerId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (e) {
    console.warn(`Firestore getDistrict failed for ${districtId}:`, e.message);
  }

  // Fallback to local
  const localDistricts = getLocal(STORAGE_KEYS.DISTRICTS, DEFAULT_DISTRICTS);
  const found = localDistricts.find(d => d.id?.toLowerCase() === lowerId);
  if (found) return found;

  return {
    id: districtId,
    name: districtId.charAt(0).toUpperCase() + districtId.slice(1),
    zone: 'West Zone',
    activeBuses: 0,
    routes: 0
  };
}

/**
 * Fetch buses belonging to a specific district
 */
export async function getBusesForDistrict(districtId) {
  ensureLocalInitialized();
  const lowerId = districtId?.toLowerCase();

  try {
    const q = query(collection(db, "buses"), where("districtId", "==", lowerId));
    const snap = await getDocs(q);
    if (snap.size > 0) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn(`Firestore getBuses for ${districtId} failed:`, e.message);
  }

  // Fallback to local
  const localBuses = getLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
  return localBuses.filter(b => b.districtId?.toLowerCase() === lowerId);
}

/**
 * Fetch single bus details
 */
export async function getBusById(busId) {
  ensureLocalInitialized();
  try {
    const snap = await getDoc(doc(db, "buses", busId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (e) {
    console.warn(`Firestore getBus failed for ${busId}:`, e.message);
  }

  const localBuses = getLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
  return localBuses.find(b => b.id === busId) || null;
}

/**
 * Fetch all routes
 */
export async function getRoutesList() {
  ensureLocalInitialized();
  let localRoutes = getLocal(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);

  try {
    const snap = await getDocs(collection(db, "routes"));
    if (snap.size > 0) {
      const cloudRoutes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal(STORAGE_KEYS.ROUTES, cloudRoutes);
      return cloudRoutes;
    }
  } catch (e) {
    console.warn("Firestore getRoutes failed:", e.message);
  }

  return localRoutes;
}

/**
 * Fetch single route
 */
export async function getRouteById(routeId) {
  ensureLocalInitialized();
  try {
    const snap = await getDoc(doc(db, "routes", routeId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (e) {
    console.warn(`Firestore getRoute failed for ${routeId}:`, e.message);
  }

  const localRoutes = getLocal(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);
  return localRoutes.find(r => r.id === routeId) || null;
}

/**
 * Save new district (persists locally immediately + attempts cloud sync)
 */
export async function saveDistrict(districtData) {
  ensureLocalInitialized();
  const dId = districtData.id.toLowerCase();
  const record = { ...districtData, id: dId };

  // Update local
  const current = getLocal(STORAGE_KEYS.DISTRICTS, DEFAULT_DISTRICTS);
  const exists = current.some(d => d.id.toLowerCase() === dId);
  const updated = exists 
    ? current.map(d => d.id.toLowerCase() === dId ? record : d)
    : [...current, record];
  setLocal(STORAGE_KEYS.DISTRICTS, updated);

  // Attempt Firestore sync
  try {
    await setDoc(doc(db, "districts", dId), record);
  } catch (e) {
    console.warn("Cloud sync for new district skipped (permissions/offline):", e.message);
  }

  return record;
}

/**
 * Save new bus
 */
export async function saveBus(busData) {
  ensureLocalInitialized();
  const current = getLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
  const exists = current.some(b => b.id === busData.id);
  const updated = exists 
    ? current.map(b => b.id === busData.id ? busData : b)
    : [...current, busData];
  setLocal(STORAGE_KEYS.BUSES, updated);

  try {
    await setDoc(doc(db, "buses", busData.id), busData);
  } catch (e) {
    console.warn("Cloud sync for bus skipped (permissions/offline):", e.message);
  }

  return busData;
}

/**
 * Delete a bus
 */
export async function deleteBusById(busId) {
  ensureLocalInitialized();
  const current = getLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
  const updated = current.filter(b => b.id !== busId);
  setLocal(STORAGE_KEYS.BUSES, updated);

  try {
    await deleteDoc(doc(db, "buses", busId));
  } catch (e) {
    console.warn("Cloud delete for bus skipped (permissions/offline):", e.message);
  }

  return true;
}

/**
 * Save route
 */
export async function saveRoute(routeData) {
  ensureLocalInitialized();
  const current = getLocal(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);
  const exists = current.some(r => r.id === routeData.id);
  const updated = exists 
    ? current.map(r => r.id === routeData.id ? routeData : r)
    : [...current, routeData];
  setLocal(STORAGE_KEYS.ROUTES, updated);

  try {
    await setDoc(doc(db, "routes", routeData.id), routeData);
  } catch (e) {
    console.warn("Cloud sync for route skipped (permissions/offline):", e.message);
  }

  return routeData;
}

/**
 * Reset local storage back to full default fleet
 */
export async function resetToDefaultFleet() {
  setLocal(STORAGE_KEYS.DISTRICTS, DEFAULT_DISTRICTS);
  setLocal(STORAGE_KEYS.BUSES, DEFAULT_BUSES);
  setLocal(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);

  let cloudSuccess = false;
  try {
    for (const d of DEFAULT_DISTRICTS) {
      await setDoc(doc(db, "districts", d.id), d);
    }
    for (const r of DEFAULT_ROUTES) {
      await setDoc(doc(db, "routes", r.id), r);
    }
    for (const b of DEFAULT_BUSES) {
      await setDoc(doc(db, "buses", b.id), b);
    }
    cloudSuccess = true;
  } catch (e) {
    console.warn("Cloud sync during reset encountered error:", e.message);
  }

  return { success: true, cloudSuccess };
}
