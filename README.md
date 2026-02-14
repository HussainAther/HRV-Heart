This README is designed to be clear for your friends on Slack and professional for your GitHub portfolio. It explains exactly how to use the "sync" feature you've built.

---

# ❤️ HRV-Heart

**HRV-Heart** is an experimental web application that allows two people to synchronize their heartbeats in real-time using nothing but a webcam. Built for Valentine's Day, it uses Photoplethysmography (PPG) to detect heart rate variability (HRV) and Firebase to bridge the distance between two hearts.

## 🚀 Live Demo

**[Click here to view the app](https://www.google.com/search?q=https://hussainather.github.io/HRV-Heart/)**

> **How to Sync:** > * **User 1:** Use `?user=userA` at the end of the URL.
> * **User 2:** Use `?user=userB` at the end of the URL.
> * Once both are live, your heart rates will appear on each other's screens!
> 
> 

## 📌 How to Use

1. **Open the link** on a device with a webcam (works great on mobile too!).
2. **Cover the camera lens** completely with your index finger.
3. **Hold steady.** For best results, use a bright light or your phone's flash to illuminate your fingertip.
4. **Watch the magic.** The app analyzes subtle changes in light intensity to calculate your BPM (Beats Per Minute).

## 🛠️ Features

* 📷 **No Sensor Required:** Uses standard webcam video frames to detect your pulse.
* 🔄 **Real-Time Sync:** Powered by Firebase Realtime Database to swap heart data instantly.
* 💖 **Visual Pulse:** A CSS-animated heart that pulses in rhythm with your detected heart rate.
* 📊 **Live Waveform:** A canvas-based visualization of your HRV data.

## 🏗️ Technical Stack

* **Frontend:** Vanilla JavaScript, HTML5, CSS3.
* **Heart Detection:** PPG (Photoplethysmography) algorithm implemented in the browser.
* **Backend:** Firebase Realtime Database for data synchronization.
* **Hosting:** GitHub Pages.

## 📂 Project Structure

* `index.html`: Main UI and webcam interface.
* `script.js`: Core heartbeat detection logic and camera processing.
* `firebase.js`: Real-time data sync and multi-user logic.
* `style.css`: The Valentine-themed UI and pulsing heart animations.

## 🤝 Social

If you enjoyed syncing your heart with a friend, feel free to star the repo!

https://www.flaticon.com/free-icon/heart_9484251
