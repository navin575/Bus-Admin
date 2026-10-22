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

const newDistricts = [
  // West Zone
  { id: 'coimbatore', name: 'Coimbatore', zone: 'West Zone', activeBuses: 6, routes: 12 },
  { id: 'erode', name: 'Erode', zone: 'West Zone', activeBuses: 6, routes: 8 },
  { id: 'tiruppur', name: 'Tiruppur', zone: 'West Zone', activeBuses: 5, routes: 7 },
  { id: 'salem', name: 'Salem', zone: 'West Zone', activeBuses: 4, routes: 6 },
  { id: 'nilgiris', name: 'The Nilgiris', zone: 'West Zone', activeBuses: 2, routes: 4 },
  { id: 'namakkal', name: 'Namakkal', zone: 'West Zone', activeBuses: 2, routes: 4 },

  // South Zone
  { id: 'madurai', name: 'Madurai', zone: 'South Zone', activeBuses: 4, routes: 9 },
  { id: 'dindigul', name: 'Dindigul', zone: 'South Zone', activeBuses: 2, routes: 5 },
  { id: 'tirunelveli', name: 'Tirunelveli', zone: 'South Zone', activeBuses: 2, routes: 5 },
  { id: 'kanyakumari', name: 'Kanyakumari', zone: 'South Zone', activeBuses: 2, routes: 4 },

  // Central Zone
  { id: 'trichy', name: 'Tiruchirappalli', zone: 'Central Zone', activeBuses: 3, routes: 8 },
  { id: 'thanjavur', name: 'Thanjavur', zone: 'Central Zone', activeBuses: 2, routes: 5 },
  { id: 'karur', name: 'Karur', zone: 'Central Zone', activeBuses: 2, routes: 4 },

  // North Zone
  { id: 'chennai', name: 'Chennai', zone: 'North Zone', activeBuses: 4, routes: 14 },
  { id: 'vellore', name: 'Vellore', zone: 'North Zone', activeBuses: 2, routes: 5 },
  { id: 'krishnagiri', name: 'Krishnagiri', zone: 'North Zone', activeBuses: 2, routes: 4 },
];

const newBuses = [
  // Chennai Buses
  { id: 'BUS-CHN-101', districtId: 'chennai', plate: 'TN-01-N-1234', capacity: 60, route: 'Route 570: CMBT Koyambedu - Kelambakkam', status: 'Active' },
  { id: 'BUS-CHN-102', districtId: 'chennai', plate: 'TN-01-N-5678', capacity: 55, route: 'Route 29C: Perambur - Besant Nagar', status: 'Active' },
  { id: 'BUS-CHN-103', districtId: 'chennai', plate: 'TN-01-N-9012', capacity: 60, route: 'Route 70: Avadi - Tambaram', status: 'Active' },

  // Madurai Buses
  { id: 'BUS-MDU-101', districtId: 'madurai', plate: 'TN-58-N-1122', capacity: 55, route: 'Route 77: Mattuthavani MIBT - Thirumangalam', status: 'Active' },
  { id: 'BUS-MDU-102', districtId: 'madurai', plate: 'TN-58-N-3344', capacity: 55, route: 'Route 48: Periyar BS - Alagar Kovil', status: 'Active' },
  { id: 'BUS-MDU-103', districtId: 'madurai', plate: 'TN-58-N-5566', capacity: 50, route: 'Route 3A: Arappalayam - Anuppanadi', status: 'Maintenance' },

  // Trichy Buses
  { id: 'BUS-TRY-101', districtId: 'trichy', plate: 'TN-45-N-9988', capacity: 55, route: 'Route 1: Central BS - Chatram BS - Srirangam', status: 'Active' },
  { id: 'BUS-TRY-102', districtId: 'trichy', plate: 'TN-45-N-7766', capacity: 50, route: 'Route 102: Central BS - Thuvakudi NIT', status: 'Active' },

  // Tirunelveli Buses
  { id: 'BUS-TNV-101', districtId: 'tirunelveli', plate: 'TN-72-N-5544', capacity: 55, route: 'Route 10: New Bus Stand - Junction - Palayamkottai', status: 'Active' },
  { id: 'BUS-TNV-102', districtId: 'tirunelveli', plate: 'TN-72-N-6677', capacity: 52, route: 'Route 35: Tirunelveli - Cheranmahadevi', status: 'Active' },

  // Kanyakumari Buses
  { id: 'BUS-KK-101', districtId: 'kanyakumari', plate: 'TN-74-N-1234', capacity: 55, route: 'Route 5: Nagercoil Christopher BS - Kanyakumari Beach', status: 'Active' },
  { id: 'BUS-KK-102', districtId: 'kanyakumari', plate: 'TN-74-N-5678', capacity: 50, route: 'Route 12: Nagercoil - Thuckalay - Marthandam', status: 'Active' },

  // Nilgiris Buses
  { id: 'BUS-NLG-101', districtId: 'nilgiris', plate: 'TN-43-N-4321', capacity: 45, route: 'Route 1: Ooty Central BS - Coonoor BS', status: 'Active' },
  { id: 'BUS-NLG-102', districtId: 'nilgiris', plate: 'TN-43-N-8765', capacity: 42, route: 'Route 8: Ooty BS - Kotagiri BS', status: 'Active' },

  // Namakkal Buses
  { id: 'BUS-NMK-101', districtId: 'namakkal', plate: 'TN-28-N-7890', capacity: 55, route: 'Route 15: Namakkal BS - Tiruchengode BS', status: 'Active' },
  { id: 'BUS-NMK-102', districtId: 'namakkal', plate: 'TN-28-N-4321', capacity: 52, route: 'Route 7: Namakkal - Rasipuram', status: 'Active' },

  // Dindigul Buses
  { id: 'BUS-DGL-101', districtId: 'dindigul', plate: 'TN-57-N-6543', capacity: 55, route: 'Route 22: Dindigul Central BS - Palani BS', status: 'Active' },
  { id: 'BUS-DGL-102', districtId: 'dindigul', plate: 'TN-57-N-3210', capacity: 50, route: 'Route 4: Dindigul - Natham', status: 'Active' },

  // Thanjavur Buses
  { id: 'BUS-TNJ-101', districtId: 'thanjavur', plate: 'TN-49-N-3456', capacity: 55, route: 'Route 8: Old Bus Stand - New Bus Stand - Kumbakonam', status: 'Active' },

  // Karur Buses
  { id: 'BUS-KRR-101', districtId: 'karur', plate: 'TN-47-N-8877', capacity: 55, route: 'Route 14: Karur Bus Stand - Velur - Paramathi', status: 'Active' },

  // Vellore Buses
  { id: 'BUS-VLR-101', districtId: 'vellore', plate: 'TN-23-N-5432', capacity: 55, route: 'Route 3: Old Bus Stand - Katpadi Railway Jn', status: 'Active' },

  // Krishnagiri Buses
  { id: 'BUS-KGI-101', districtId: 'krishnagiri', plate: 'TN-24-N-9876', capacity: 55, route: 'Route 100: Hosur Bus Stand - Krishnagiri Central BS', status: 'Active' },
];

async function seedDistricts() {
  try {
    console.log("Seeding 16 Tamil Nadu districts...");
    for (const d of newDistricts) {
      await setDoc(doc(db, "districts", d.id), d);
    }

    console.log("Seeding buses for all new districts...");
    for (const b of newBuses) {
      await setDoc(doc(db, "buses", b.id), b);
    }

    console.log("✅ Successfully seeded 16 Tamil Nadu districts and fleet data!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding districts:", err);
    process.exit(1);
  }
}

seedDistricts();
