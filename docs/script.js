const video = document.getElementById("webcam");
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");
const heartRateDisplay = document.getElementById("heart-rate");
const heartIcon = document.getElementById("main-heart");

let frameData = [];
let lastPeakTime = null;
let rrIntervals = [];

// 1. Initialize Webcam
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(processFrame);
  })
  .catch(err => {
    console.error("Camera access denied:", err);
    alert("Please allow camera access to detect your heart rate!");
  });

// 2. Continuous Processing Loop
function processFrame() {
    if (video.paused || video.ended) return;

    // Create a tiny temporary canvas to get average color
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 10;
    tempCanvas.height = 10;
    tempCtx.drawImage(video, 0, 0, 10, 10);
    
    const pixels = tempCtx.getImageData(0, 0, 10, 10).data;
    let redSum = 0;
    
    // PPG works by looking for changes in the Red channel
    for (let i = 0; i < pixels.length; i += 4) {
        redSum += pixels[i]; 
    }
    
    frameData.push(redSum);
    if (frameData.length > 100) frameData.shift();

    drawWaveform();
    detectHeartbeat();
    requestAnimationFrame(processFrame);
}

// 3. Heartbeat Detection Logic
function detectHeartbeat() {
    if (frameData.length < 5) return;
    
    const maxValue = Math.max(...frameData);
    const minValue = Math.min(...frameData);
    const threshold = (maxValue + minValue) / 2;

    // Detect a "peak" where the red intensity crosses the midpoint
    if (frameData[frameData.length - 1] > threshold && frameData[frameData.length - 2] <= threshold) {
        const now = performance.now();
        if (lastPeakTime) {
            const rrInterval = now - lastPeakTime;
            
            // Filter: 40 BPM (1500ms) to 180 BPM (333ms)
            if (rrInterval > 333 && rrInterval < 1500) {
                rrIntervals.push(rrInterval);
                if (rrIntervals.length > 10) rrIntervals.shift();
                updateHeartUI();
            }
        }
        lastPeakTime = now;
    }
}

// 4. UI & Sync Updates
function updateHeartUI() {
    if (rrIntervals.length < 2) return;
    const avgRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
    const bpm = Math.round(60000 / avgRR);
    
    heartRateDisplay.innerText = `BPM: ${bpm}`;

    // Update Pulse Speed: Matches the animation to your actual heart rate
    const pulseDuration = 60 / bpm; 
    heartIcon.style.animationDuration = `${pulseDuration}s`;

    // Sync to Firebase (global function from firebase.js)
    if (window.syncHeartRate) {
        window.syncHeartRate(bpm);
    }
}

// 5. Visualize the "Vibe"
function drawWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ff477e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const step = canvas.width / frameData.length;
    for (let i = 0; i < frameData.length; i++) {
        const x = i * step;
        const y = canvas.height - ((frameData[i] - Math.min(...frameData)) / 
                 (Math.max(...frameData) - Math.min(...frameData) + 1)) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}
