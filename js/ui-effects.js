const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

export function drawWaveform(rrIntervals) {
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

export function animateHeartSync() {
    const heart = document.getElementById("heart-icon");
    heart.style.animation = "heartbeat 1s infinite";
}

