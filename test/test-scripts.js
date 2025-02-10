import { syncHeartRate, listenForHeartRateUpdate } from "./heart-sync.js";

// Test function to simulate heartbeat data updates
function testHeartbeatSync() {
    console.log("Testing Heartbeat Sync...");
    let testBPM = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Random BPM between 60-100
    syncHeartRate(testBPM);
    console.log(`Test BPM sent: ${testBPM}`);
}

// Test function to listen for heartbeat updates
function testListenForUpdates() {
    listenForHeartRateUpdate((bpm) => {
        console.log(`Received BPM update: ${bpm}`);
    });
}

// Run Tests
console.log("Starting Tests...");
testHeartbeatSync();
testListenForUpdates();

