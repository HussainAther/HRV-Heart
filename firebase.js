// firebase.js - Real-time Heartbeat Sync
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_tOEPqnuVmsR2PZlbgycEUQlYNqH-fCo",
    authDomain: "hrv-heart.firebaseapp.com",
    databaseURL: "https://hrv-heart-default-rtdb.firebaseio.com",
    projectId: "hrv-heart",
    storageBucket: "hrv-heart.firebasestorage.app",
    messagingSenderId: "288913403113",
    appId: "1:288913403113:web:923b9084fc6a9d9b599478",
    measurementId: "G-3QN8RPJFCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Determine user roles from the URL (?user=userA or ?user=userB)
const params = new URLSearchParams(window.location.search);
const userId = params.get('user') || 'userA'; 
const partnerId = userId === 'userA' ? 'userB' : 'userA';

// Database references
const myHeartRef = ref(db, `heartbeats/${userId}`);
const partnerHeartRef = ref(db, `heartbeats/${partnerId}`);

// Variables to track local and partner BPM for the "Sync Match" logic
let localBPM = 0;

/**
 * Sends the detected BPM to the Realtime Database
 * This is called from script.js
 */
window.syncHeartRate = function(bpm) {
    localBPM = bpm; // Store locally for comparison
    set(myHeartRef, { 
        bpm: bpm, 
        timestamp: Date.now() 
    });
};

/**
 * Listens for updates from the partner's data slot
 */
onValue(partnerHeartRef, (snapshot) => {
    const data = snapshot.val();
    const statusEl = document.getElementById("sync-status");
    
    if (data) {
        const partnerBPM = data.bpm;
        const lastUpdate = data.timestamp;
        const now = Date.now();

        // Check if data is "fresh" (sent within the last 10 seconds)
        if (now - lastUpdate < 10000) {
            statusEl.innerText = `Partner: ${partnerBPM} BPM`;
            
            // Trigger "Match" effect if heart rates are within 3 BPM of each other
            if (localBPM > 0 && Math.abs(localBPM - partnerBPM) <= 3) {
                statusEl.innerText = "💖 Hearts in Sync! 💖";
                statusEl.classList.add("synced");
            } else {
                statusEl.classList.remove("synced");
            }
        } else {
            statusEl.innerText = "Partner went offline...";
            statusEl.classList.remove("synced");
        }
    } else {
        statusEl.innerText = "Waiting for partner...";
    }
});
