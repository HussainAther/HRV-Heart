import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_tOEPqnuVmsR2PZlbgycEUQlYNqH-fCo",
    authDomain: "hrv-heart.firebaseapp.com",
    projectId: "hrv-heart",
    storageBucket: "hrv-heart.firebasestorage.app",
    messagingSenderId: "288913403113",
    appId: "1:288913403113:web:923b9084fc6a9d9b599478",
    measurementId: "G-3QN8RPJFCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Logic to identify User A vs User B via URL
const params = new URLSearchParams(window.location.search);
const userId = params.get('user') || 'userA'; 
const partnerId = userId === 'userA' ? 'userB' : 'userA';

const myHeartRef = ref(db, `heartbeats/${userId}`);
const partnerHeartRef = ref(db, `heartbeats/${partnerId}`);

// Export function to the global window so script.js can call it
window.syncHeartRate = function(bpm) {
    set(myHeartRef, { 
        bpm: bpm, 
        timestamp: Date.now() 
    });
};

// Listen for your friend's heart rate
onValue(partnerHeartRef, (snapshot) => {
    const data = snapshot.val();
    const statusEl = document.getElementById("sync-status");
    if (data && (Date.now() - data.timestamp < 5000)) { // Only show if updated in last 5s
        statusEl.innerText = `Partner: ${data.bpm} BPM`;
    } else {
        statusEl.innerText = "Waiting for partner...";
    }
});
