import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWLmA5xVE2tKXsZ11W22sO__s1jSmklKI",
  authDomain: "tnstc-smart-transit.firebaseapp.com",
  databaseURL: "https://tnstc-smart-transit-default-rtdb.firebaseio.com",
  projectId: "tnstc-smart-transit",
  storageBucket: "tnstc-smart-transit.firebasestorage.app",
  messagingSenderId: "677760252988",
  appId: "1:677760252988:web:55d71d77e699d5614a5739",
  measurementId: "G-XE1JMBR9VE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const districts = [
  { id: 'coimbatore', name: 'Coimbatore', activeBuses: 5, routes: 12 },
  { id: 'erode', name: 'Erode', activeBuses: 4, routes: 8 },
  { id: 'salem', name: 'Salem', activeBuses: 3, routes: 7 },
  { id: 'tiruppur', name: 'Tiruppur', activeBuses: 3, routes: 6 },
];

const routes = [
  {
    id: 'ROUTE-CBE-101',
    name: 'Route 70: Gandhipuram - Marudhamalai',
    start: 'Gandhipuram Central BS',
    end: 'Marudhamalai Temple',
    stops: [
      { id: 'ST-CBE-01', name: 'Gandhipuram Central BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-02', name: 'Cross Cut Road', lat: '11.0210', lng: '76.9602', isKeyStop: false },
      { id: 'ST-CBE-03', name: 'Lawley Road Jn', lat: '11.0125', lng: '76.9360', isKeyStop: false },
      { id: 'ST-CBE-04', name: 'TNAU Campus', lat: '11.0135', lng: '76.9280', isKeyStop: false },
      { id: 'ST-CBE-05', name: 'Vadavalli Terminal', lat: '11.0264', lng: '76.9038', isKeyStop: false },
      { id: 'ST-CBE-06', name: 'Marudhamalai Foothills', lat: '11.0450', lng: '76.8525', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-CBE-102',
    name: 'Route 3: Gandhipuram - Ukkadam BS',
    start: 'Gandhipuram BS',
    end: 'Ukkadam Bus Stand',
    stops: [
      { id: 'ST-CBE-11', name: 'Gandhipuram BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-12', name: 'Coimbatore Junction RS', lat: '10.9995', lng: '76.9635', isKeyStop: false },
      { id: 'ST-CBE-13', name: 'Town Hall', lat: '10.9960', lng: '76.9610', isKeyStop: false },
      { id: 'ST-CBE-14', name: 'Ukkadam Bus Stand', lat: '10.9880', lng: '76.9580', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-ER-101',
    name: 'Route 1A: Erode BS - Gobi',
    start: 'Erode Bus Stand',
    end: 'Gobichettipalayam',
    stops: [
      { id: 'ST-01', name: 'Erode Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-02', name: 'Chithode', lat: '11.3855', lng: '77.6713', isKeyStop: false },
      { id: 'ST-03', name: 'Kavindapadi', lat: '11.4167', lng: '77.5833', isKeyStop: false },
      { id: 'ST-04', name: 'Gobichettipalayam BS', lat: '11.4552', lng: '77.4385', isKeyStop: true }
    ]
  }
];

const buses = [
  // Coimbatore Fleet
  { id: 'BUS-CBE-101', districtId: 'coimbatore', plate: 'TN-38-N-2415', capacity: 55, route: 'Gandhipuram - Marudhamalai', routeId: 'ROUTE-CBE-101', status: 'Active' },
  { id: 'BUS-CBE-102', districtId: 'coimbatore', plate: 'TN-38-N-3890', capacity: 50, route: 'Gandhipuram - Ukkadam BS', routeId: 'ROUTE-CBE-102', status: 'Active' },
  { id: 'BUS-CBE-103', districtId: 'coimbatore', plate: 'TN-38-N-4122', capacity: 60, route: 'Ukkadam - Pollachi BS', status: 'Active' },
  { id: 'BUS-CBE-104', districtId: 'coimbatore', plate: 'TN-38-N-5011', capacity: 55, route: 'Singanallur - Gandhipuram', status: 'Active' },
  { id: 'BUS-CBE-105', districtId: 'coimbatore', plate: 'TN-38-N-6330', capacity: 52, route: 'Gandhipuram - Thudiyalur', status: 'Maintenance' },

  // Erode Fleet
  { id: 'BUS-ER-101', districtId: 'erode', plate: 'TN-33-N-1234', capacity: 55, route: 'Erode BS - Gobichettipalayam', routeId: 'ROUTE-ER-101', status: 'Active' },
  { id: 'BUS-ER-102', districtId: 'erode', plate: 'TN-33-N-5678', capacity: 50, route: 'Erode BS - Perundurai', status: 'Active' },
  { id: 'BUS-ER-103', districtId: 'erode', plate: 'TN-33-N-9012', capacity: 60, route: 'Erode BS - Bhavani', status: 'Maintenance' },
  { id: 'BUS-ER-104', districtId: 'erode', plate: 'TN-33-N-3456', capacity: 52, route: 'Erode BS - Sathyamangalam', status: 'Active' },

  // Salem Fleet
  { id: 'BUS-SLM-101', districtId: 'salem', plate: 'TN-30-N-1122', capacity: 55, route: 'Salem Old BS - New BS', status: 'Active' },
  { id: 'BUS-SLM-102', districtId: 'salem', plate: 'TN-30-N-2244', capacity: 50, route: 'Salem BS - Omalur', status: 'Active' },
  { id: 'BUS-SLM-103', districtId: 'salem', plate: 'TN-30-N-3366', capacity: 58, route: 'Salem BS - Attur', status: 'Maintenance' },

  // Tiruppur Fleet
  { id: 'BUS-TPR-101', districtId: 'tiruppur', plate: 'TN-39-N-1010', capacity: 52, route: 'Old Bus Stand - New Bus Stand', status: 'Active' },
  { id: 'BUS-TPR-102', districtId: 'tiruppur', plate: 'TN-39-N-2020', capacity: 55, route: 'Tiruppur - Avinashi', status: 'Active' },
  { id: 'BUS-TPR-103', districtId: 'tiruppur', plate: 'TN-39-N-3030', capacity: 50, route: 'Tiruppur - Palladam', status: 'Active' }
];

async function seedFullFleet() {
  try {
    console.log("1. Updating districts...");
    for (const district of districts) {
      await setDoc(doc(db, "districts", district.id), district);
    }

    console.log("2. Writing routes...");
    for (const route of routes) {
      await setDoc(doc(db, "routes", route.id), route);
    }

    console.log("3. Seeding all buses...");
    for (const bus of buses) {
      await setDoc(doc(db, "buses", bus.id), bus);
    }

    console.log("✅ Successfully seeded Coimbatore, Erode, Salem, and Tiruppur fleets!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding fleet:", error);
    process.exit(1);
  }
}

seedFullFleet();
