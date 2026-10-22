import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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
  { id: 'erode', name: 'Erode', activeBuses: 124, routes: 45 },
  { id: 'salem', name: 'Salem', activeBuses: 210, routes: 82 },
  { id: 'coimbatore', name: 'Coimbatore', activeBuses: 350, routes: 115 },
  { id: 'tiruppur', name: 'Tiruppur', activeBuses: 95, routes: 34 },
];

const buses = [
  { id: 'BUS-ER-101', districtId: 'erode', plate: 'TN-33-N-1234', capacity: 55, route: 'Erode BS - Gobichettipalayam', status: 'Active' },
  { id: 'BUS-ER-102', districtId: 'erode', plate: 'TN-33-N-5678', capacity: 50, route: 'Erode BS - Perundurai', status: 'Active' },
  { id: 'BUS-ER-103', districtId: 'erode', plate: 'TN-33-N-9012', capacity: 60, route: 'Erode BS - Bhavani', status: 'Maintenance' },
];

async function seedData() {
  try {
    console.log("Seeding districts...");
    for (const district of districts) {
      await setDoc(doc(db, "districts", district.id), district);
    }
    console.log("Seeding buses...");
    for (const bus of buses) {
      await setDoc(doc(db, "buses", bus.id), bus);
    }
    console.log("✅ Successfully seeded database!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedData();
