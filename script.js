// script.js - Heartbeat Detection & Visualization
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
  const bpm = Math.round(60000 / avgRR); // Clean integer for display
  heartRateDisplay.innerText = `Heart Rate: ${bpm} BPM`;

  // ADD THIS LINE:
  if (typeof syncHeartRate === "function") {
    syncHeartRate(bpm);
  }
}
