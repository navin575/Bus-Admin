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

const newRoutes = [
  // 1. Tiruppur - Kangayam
  {
    id: 'ROUTE-TPR-101',
    name: 'Route 24: Tiruppur Old BS - Kangayam',
    districtId: 'tiruppur',
    start: 'Tiruppur Old Bus Stand',
    end: 'Kangayam Bus Stand',
    towns: ['Tiruppur', 'Nallur', 'Kovilvazhi', 'Kangayam'],
    stops: [
      { id: 'ST-KGM-01', name: 'Tiruppur Old Bus Stand', lat: '11.1085', lng: '77.3411', isKeyStop: true },
      { id: 'ST-KGM-02', name: 'Nallur Branch', lat: '11.0820', lng: '77.3750', isKeyStop: false },
      { id: 'ST-KGM-03', name: 'Kovilvazhi Jn', lat: '11.0560', lng: '77.4120', isKeyStop: false },
      { id: 'ST-KGM-04', name: 'Chengapalli Pirivu', lat: '11.0310', lng: '77.4850', isKeyStop: false },
      { id: 'ST-KGM-05', name: 'Kangayam Central Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true }
    ]
  },
  // 2. Erode - Kangayam - Dharapuram
  {
    id: 'ROUTE-ER-102',
    name: 'Route 45: Erode - Kangayam - Dharapuram',
    districtId: 'erode',
    start: 'Erode Central Bus Stand',
    end: 'Dharapuram Bus Stand',
    towns: ['Erode', 'Solar', 'Muthur', 'Kangayam', 'Kundadam', 'Dharapuram'],
    stops: [
      { id: 'ST-ER-KGM-01', name: 'Erode Central Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-ER-KGM-02', name: 'Solar Bus Terminal', lat: '11.3120', lng: '77.7450', isKeyStop: false },
      { id: 'ST-ER-KGM-03', name: 'Muthur Bus Stop', lat: '11.1180', lng: '77.6320', isKeyStop: false },
      { id: 'ST-ER-KGM-04', name: 'Kangayam Central Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true },
      { id: 'ST-ER-KGM-05', name: 'Kundadam Pirivu', lat: '10.8750', lng: '77.6020', isKeyStop: false },
      { id: 'ST-ER-KGM-06', name: 'Dharapuram Central Bus Stand', lat: '10.7280', lng: '77.5260', isKeyStop: true }
    ]
  },
  // 3. Coimbatore - Palladam - Kangayam Express
  {
    id: 'ROUTE-CBE-103',
    name: 'Route 112X: Gandhipuram - Palladam - Kangayam',
    districtId: 'coimbatore',
    start: 'Gandhipuram Central BS',
    end: 'Kangayam Bus Stand',
    towns: ['Coimbatore', 'Singanallur', 'Sulur', 'Palladam', 'Kangayam'],
    stops: [
      { id: 'ST-CBE-KGM-01', name: 'Gandhipuram Central BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-KGM-02', name: 'Singanallur Bus Terminal', lat: '11.0010', lng: '77.0260', isKeyStop: true },
      { id: 'ST-CBE-KGM-03', name: 'Sulur Aero Town', lat: '11.0320', lng: '77.1250', isKeyStop: false },
      { id: 'ST-CBE-KGM-04', name: 'Palladam Central Bus Stand', lat: '10.9980', lng: '77.2910', isKeyStop: true },
      { id: 'ST-CBE-KGM-05', name: 'Kangayam Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true }
    ]
  },
  // 4. Erode - Gobi - Sathyamangalam
  {
    id: 'ROUTE-ER-103',
    name: 'Route 12B: Erode - Gobichettipalayam - Sathyamangalam',
    districtId: 'erode',
    start: 'Erode Bus Stand',
    end: 'Sathyamangalam Bus Stand',
    towns: ['Erode', 'Chithode', 'Kavindapadi', 'Gobichettipalayam', 'Sathyamangalam'],
    stops: [
      { id: 'ST-STY-01', name: 'Erode Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-STY-02', name: 'Chithode Jn', lat: '11.3855', lng: '77.6713', isKeyStop: false },
      { id: 'ST-STY-03', name: 'Kavindapadi', lat: '11.4167', lng: '77.5833', isKeyStop: false },
      { id: 'ST-STY-04', name: 'Gobichettipalayam Bus Stand', lat: '11.4552', lng: '77.4385', isKeyStop: true },
      { id: 'ST-STY-05', name: 'Alathucombai', lat: '11.4820', lng: '77.3420', isKeyStop: false },
      { id: 'ST-STY-06', name: 'Sathyamangalam Bus Stand', lat: '11.5042', lng: '77.2415', isKeyStop: true }
    ]
  },
  // 5. Ukkadam - Pollachi - Udumalaipettai
  {
    id: 'ROUTE-CBE-104',
    name: 'Route 55: Ukkadam - Pollachi - Udumalaipettai',
    districtId: 'coimbatore',
    start: 'Ukkadam Bus Stand',
    end: 'Udumalaipettai Central BS',
    towns: ['Coimbatore', 'Kinathukadavu', 'Pollachi', 'Gomangalam', 'Udumalaipettai'],
    stops: [
      { id: 'ST-UDM-01', name: 'Ukkadam Bus Stand', lat: '10.9880', lng: '76.9580', isKeyStop: true },
      { id: 'ST-UDM-02', name: 'Kinathukadavu Bus Stop', lat: '10.8190', lng: '77.0190', isKeyStop: false },
      { id: 'ST-UDM-03', name: 'Pollachi New Bus Stand', lat: '10.6610', lng: '77.0060', isKeyStop: true },
      { id: 'ST-UDM-04', name: 'Gomangalam', lat: '10.6120', lng: '77.1450', isKeyStop: false },
      { id: 'ST-UDM-05', name: 'Udumalaipettai Central BS', lat: '10.5840', lng: '77.2470', isKeyStop: true }
    ]
  },
  // 6. Coimbatore - Mettupalayam (Ooty Foothills)
  {
    id: 'ROUTE-CBE-105',
    name: 'Route 4A: Gandhipuram - Mettupalayam',
    districtId: 'coimbatore',
    start: 'Gandhipuram Bus Stand',
    end: 'Mettupalayam Bus Stand',
    towns: ['Coimbatore', 'Thudiyalur', 'Periyanaickenpalayam', 'Karamadai', 'Mettupalayam'],
    stops: [
      { id: 'ST-MTP-01', name: 'Gandhipuram Bus Stand', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-MTP-02', name: 'Thudiyalur Jn', lat: '11.0820', lng: '76.9380', isKeyStop: false },
      { id: 'ST-MTP-03', name: 'Periyanaickenpalayam', lat: '11.1460', lng: '76.9320', isKeyStop: false },
      { id: 'ST-MTP-04', name: 'Karamadai Bus Stop', lat: '11.2420', lng: '76.9580', isKeyStop: false },
      { id: 'ST-MTP-05', name: 'Mettupalayam Bus Stand', lat: '11.3015', lng: '76.9510', isKeyStop: true }
    ]
  },
  // 7. Erode - Bhavani - Komarapalayam
  {
    id: 'ROUTE-ER-104',
    name: 'Route 6: Erode BS - Bhavani - Komarapalayam',
    districtId: 'erode',
    start: 'Erode Central Bus Stand',
    end: 'Komarapalayam Bus Stand',
    towns: ['Erode', 'Bhavani', 'Komarapalayam'],
    stops: [
      { id: 'ST-KMR-01', name: 'Erode Central BS', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-KMR-02', name: 'B.P. Agraharam', lat: '11.3780', lng: '77.7190', isKeyStop: false },
      { id: 'ST-KMR-03', name: 'Bhavani Old Bus Stand', lat: '11.4460', lng: '77.6830', isKeyStop: true },
      { id: 'ST-KMR-04', name: 'Cauvery River Checkpost', lat: '11.4420', lng: '77.7010', isKeyStop: false },
      { id: 'ST-KMR-05', name: 'Komarapalayam Bus Stand', lat: '11.4390', lng: '77.7180', isKeyStop: true }
    ]
  },
  // 8. Salem - Omalur - Mettur Dam
  {
    id: 'ROUTE-SLM-101',
    name: 'Route 18: Salem New BS - Omalur - Mettur Dam',
    districtId: 'salem',
    start: 'Salem New Bus Stand',
    end: 'Mettur Dam Bus Stand',
    towns: ['Salem', 'Omalur', 'Mecheri', 'Mettur'],
    stops: [
      { id: 'ST-MTR-01', name: 'Salem New Bus Stand', lat: '11.6643', lng: '78.1460', isKeyStop: true },
      { id: 'ST-MTR-02', name: 'Mamangam Jn', lat: '11.6920', lng: '78.1150', isKeyStop: false },
      { id: 'ST-MTR-03', name: 'Omalur Bus Stand', lat: '11.7450', lng: '78.0410', isKeyStop: true },
      { id: 'ST-MTR-04', name: 'Mecheri Town', lat: '11.8310', lng: '77.9450', isKeyStop: false },
      { id: 'ST-MTR-05', name: 'Mettur Dam Bus Stand', lat: '11.7960', lng: '77.8010', isKeyStop: true }
    ]
  }
];

const newBuses = [
  // Kangayam Buses
  { id: 'BUS-TPR-104', districtId: 'tiruppur', plate: 'TN-39-N-4455', capacity: 55, route: 'Route 24: Tiruppur Old BS - Kangayam', routeId: 'ROUTE-TPR-101', status: 'Active' },
  { id: 'BUS-TPR-105', districtId: 'tiruppur', plate: 'TN-39-N-5566', capacity: 50, route: 'Route 45: Erode - Kangayam - Dharapuram', routeId: 'ROUTE-ER-102', status: 'Active' },
  { id: 'BUS-ER-105', districtId: 'erode', plate: 'TN-33-N-7788', capacity: 55, route: 'Route 45: Erode - Kangayam - Dharapuram', routeId: 'ROUTE-ER-102', status: 'Active' },
  { id: 'BUS-CBE-106', districtId: 'coimbatore', plate: 'TN-38-N-7722', capacity: 55, route: 'Route 112X: Gandhipuram - Palladam - Kangayam', routeId: 'ROUTE-CBE-103', status: 'Active' },

  // Sathyamangalam & Bhavani/Komarapalayam Buses
  { id: 'BUS-ER-106', districtId: 'erode', plate: 'TN-33-N-8899', capacity: 50, route: 'Route 12B: Erode - Gobichettipalayam - Sathyamangalam', routeId: 'ROUTE-ER-103', status: 'Active' },
  { id: 'BUS-ER-107', districtId: 'erode', plate: 'TN-33-N-9911', capacity: 52, route: 'Route 6: Erode BS - Bhavani - Komarapalayam', routeId: 'ROUTE-ER-104', status: 'Active' },

  // Pollachi / Udumalaipettai & Mettupalayam Buses
  { id: 'BUS-CBE-107', districtId: 'coimbatore', plate: 'TN-38-N-8833', capacity: 60, route: 'Route 55: Ukkadam - Pollachi - Udumalaipettai', routeId: 'ROUTE-CBE-104', status: 'Active' },
  { id: 'BUS-CBE-108', districtId: 'coimbatore', plate: 'TN-38-N-9944', capacity: 55, route: 'Route 4A: Gandhipuram - Mettupalayam', routeId: 'ROUTE-CBE-105', status: 'Active' },

  // Salem - Mettur Dam Bus
  { id: 'BUS-SLM-104', districtId: 'salem', plate: 'TN-30-N-4477', capacity: 55, route: 'Route 18: Salem New BS - Omalur - Mettur Dam', routeId: 'ROUTE-SLM-101', status: 'Active' }
];

async function seedNewRoutes() {
  try {
    console.log("Writing new routes to Firestore...");
    for (const r of newRoutes) {
      await setDoc(doc(db, "routes", r.id), r);
    }

    console.log("Writing new buses to Firestore...");
    for (const b of newBuses) {
      await setDoc(doc(db, "buses", b.id), b);
    }

    console.log("✅ Successfully seeded Kangayam, Dharapuram, Sathyamangalam, Pollachi, Udumalaipettai, Mettupalayam routes!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding routes:", error);
    process.exit(1);
  }
}

seedNewRoutes();
