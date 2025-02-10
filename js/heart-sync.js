import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const db = getDatabase();
const heartRateRef = ref(db, 'heartbeats');

export function syncHeartRate(bpm) {
    set(heartRateRef, { bpm });
}

export function listenForHeartRateUpdate(callback) {
    onValue(heartRateRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data.bpm);
        }
    });
}

