// firebase.js - Firebase Real-Time Sync
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const heartRateRef = ref(db, 'heartbeats');

function syncHeartRate(bpm) {
  set(heartRateRef, { bpm });
}

onValue(heartRateRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    document.getElementById("sync-status").innerText = `Partner’s Heart Rate: ${data.bpm} BPM`;
  }
});

