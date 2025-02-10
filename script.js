/* HRV-Heart Project Structure */

HRV-Heart/
│-- index.html         // Main HTML file for the UI
│-- style.css          // Stylesheet for visuals
│-- script.js          // Heartbeat detection + syncing logic
│-- firebase.js        // Firebase setup for real-time syncing
│-- assets/            // Images, icons, and additional assets
│-- README.md          // Project documentation
│-- .gitignore         // Ignore node_modules, Firebase secrets, etc.

/* index.html - Main UI */
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HRV-Heart ❤️</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>HRV-Heart ❤️</h1>
    <p>Sync your heartbeat with a loved one!</p>
    <video id="webcam" autoplay playsinline></video>
    <canvas id="waveform"></canvas>
    <div id="heart-rate">Heart Rate: -- BPM</div>
    <div id="sync-status">Waiting for partner...</div>
    <script src="script.js"></script>
    <script src="firebase.js"></script>
</body>
</html>

/* style.css - Enhanced Styling */
body {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: #ffe5ec;
    color: #ff477e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
canvas {
    width: 80%;
    height: 200px;
    background-color: white;
    border: 2px solid #ff477e;
    margin-top: 20px;
}
h1 {
    font-size: 2rem;
}
p {
    font-size: 1.2rem;
    margin-bottom: 20px;
}
#heart-rate, #sync-status {
    font-size: 1.5rem;
    margin-top: 10px;
}

/* script.js - Heartbeat Detection & Visualization */
const video = document.getElementById("webcam");
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");
const heartRateDisplay = document.getElementById("heart-rate");
let frameData = [];
let lastPeakTime = null;
let rrIntervals = [];

navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => console.error("Camera access denied: ", err));

function detectHeartbeat() {
  if (frameData.length < 2) return;
  const maxValue = Math.max(...frameData);
  const minValue = Math.min(...frameData);
  const threshold = (maxValue + minValue) / 2;
  if (frameData[frameData.length - 1] > threshold && frameData[frameData.length - 2] <= threshold) {
    const now = performance.now();
    if (lastPeakTime) {
      const rrInterval = now - lastPeakTime;
      rrIntervals.push(rrInterval);
      if (rrIntervals.length > 10) rrIntervals.shift();
      calculateHRV();
    }
    lastPeakTime = now;
  }
}

function calculateHRV() {
  if (rrIntervals.length < 2) return;
  const avgRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
  const bpm = 60000 / avgRR;
  heartRateDisplay.innerText = `Heart Rate: ${Math.round(bpm)} BPM`;
  drawWaveform();
}

function drawWaveform() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  for (let i = 0; i < rrIntervals.length; i++) {
    let x = (i / rrIntervals.length) * canvas.width;
    let y = canvas.height / 2 - (rrIntervals[i] - Math.min(...rrIntervals)) / (Math.max(...rrIntervals) - Math.min(...rrIntervals)) * 50;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#ff477e";
  ctx.lineWidth = 2;
  ctx.stroke();
}

/* firebase.js - Firebase Real-Time Sync */
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
