import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWLmA5xVE2tKXsZ11W22sO__s1jSmklKI",
  authDomain: "tnstc-smart-transit.firebaseapp.com",
  databaseURL: "https://tnstc-smart-transit-default-rtdb.firebaseio.com",
  projectId: "tnstc-smart-transit",
  storageBucket: "tnstc-smart-transit.firebasestorage.app",
  messagingSenderId: "677760252988",
  appId: "1:677760252988:web:55d71d77e699d5614a5739"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const routeData = {
  id: 'ROUTE-101',
  name: 'Route 1A: Erode BS - Gobi',
  start: 'Erode Bus Stand',
  end: 'Gobichettipalayam',
  stops: [
    { id: 'ST-01', name: 'Erode Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
    { id: 'ST-02', name: 'Chithode', lat: '11.3855', lng: '77.6713', isKeyStop: false },
    { id: 'ST-03', name: 'Kavindapadi', lat: '11.4167', lng: '77.5833', isKeyStop: false },
    { id: 'ST-04', name: 'Gobichettipalayam BS', lat: '11.4552', lng: '77.4385', isKeyStop: true }
  ]
};

async function updateDatabase() {
  try {
    console.log("Creating dedicated 'routes' collection...");
    await setDoc(doc(db, "routes", routeData.id), routeData);

    console.log("Linking buses to the new route...");
    // Linking BUS-ER-101 to this route
    await updateDoc(doc(db, "buses", "BUS-ER-101"), {
      routeId: "ROUTE-101",
      route: "Erode BS - Gobichettipalayam" // Keeping string for simple list views if needed
    });

    console.log("✅ Successfully updated database with routes and stops!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating database:", error);
    process.exit(1);
  }
}

updateDatabase();
