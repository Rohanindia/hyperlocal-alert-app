# 🚨 AI Hyperlocal Emergency Alert App

> **PromptWars Virtual — Hack2skill × Google for Developers**
> Built with Google Antigravity · Gemini 2.0 Flash · Firebase · React

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase%20Hosting-orange)](https://hyperlocal-alert-app.web.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-blue)](https://github.com/Rohanindia/hyperlocal-alert-app)
[![Gemini API](https://img.shields.io/badge/Powered%20by-Gemini%202.0%20Flash-green)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20Realtime%20DB-yellow)](https://firebase.google.com/)

## 🧩 Problem Statement

Hospitality venues, public spaces, and communities face unpredictable, high-stakes emergencies that demand instantaneous, coordinated responses to protect lives and property. During a crisis, critical information is often siloed — fracturing communication between distressed individuals, on-site staff, and first responders.

Existing alert systems lack hyperlocal awareness, real-time AI triage, and instant geographic visualization, leading to delayed response and loss of life.

## 💡 Solution Overview

AI Hyperlocal Emergency Alert App is a real-time, AI-powered emergency reporting and alerting platform that:
- Enables citizens to instantly report emergencies (fire, flood, accident, medical, crime) with location tagging
- Uses Google Gemini 2.0 Flash API to automatically classify, prioritize, and validate alert severity using AI
- Stores and syncs alerts in real time via Firebase Realtime Database, ensuring zero data loss
- Displays all active alerts on an interactive Leaflet.js map with color-coded severity pins
- Filters alerts within a 2km radius of the user — delivering only hyperlocal, relevant emergency information
- Eliminates fragmented communication by creating a reliable bridge between distressed individuals and emergency-aware communities

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Fast, component-based UI |
| AI Engine | Google Gemini 2.0 Flash API | Alert classification and severity analysis |
| Database | Firebase Realtime Database | Live data sync and persistence |
| Map | Leaflet.js | Interactive geospatial alert visualization |
| Hosting | Firebase Hosting | Global CDN deployment |
| Build Tool | Google Antigravity | AI-native app development |

## ✨ Key Features

### 🤖 AI-Powered Alert Classification (Gemini 2.0 Flash)
- Classifies alerts into: FIRE, FLOOD, MEDICAL, ACCIDENT, CRIME, INFRASTRUCTURE, OTHER
- Assigns severity levels: LOW, MEDIUM, HIGH, CRITICAL
- Falls back to keyword-based classification if API is unavailable — ensuring 100% uptime
- Validates alert descriptions and rejects spam/false reports

### 📍 Hyperlocal Filtering (2km Radius)
- Uses Haversine formula for precise geospatial distance calculation
- Shows only alerts within 2km of the user's current GPS location
- Prevents alert fatigue from irrelevant distant incidents

### 🗺️ Interactive Map View (Leaflet.js)
- Color-coded pins: Critical, High, Medium, Low
- Click any pin to view full alert details
- Real-time pin updates as new alerts are reported

### ⚡ Real-Time Feed (Firebase)
- Alerts appear instantly across all connected devices
- Firebase Realtime Database WebSocket connection for sub-second updates
- Persistent storage — alerts survive page refresh

### 🔒 Input Validation and Security
- Client-side input sanitization on all form fields
- No raw API keys exposed in frontend (environment variables via .env)

## 🚀 Getting Started

git clone https://github.com/Rohanindia/hyperlocal-alert-app.git
cd hyperlocal-alert-app
npm install
npm run dev

## 🧪 Testing

npm test

## 🌐 Google Services Used

| Service | Usage |
|---------|-------|
| Google Gemini 2.0 Flash API | AI alert classification, severity scoring |
| Firebase Realtime Database | Real-time alert storage and live sync |
| Firebase Hosting | Production deployment on global CDN |
| Google Antigravity | AI-native development environment |

## 📊 Impact and Use Cases

- Citizens: Report emergencies instantly with one tap
- Communities: See what is happening within 2km in real time
- Emergency Responders: Get AI-triaged, severity-ranked alerts on a live map
- Smart Cities: Foundation for a city-wide hyperlocal emergency mesh network

## 🔮 Future Roadmap

- Push notifications for critical alerts in radius
- Offline support with Service Workers
- Multi-language support (Hindi, Kannada, etc.)
- Alert verification via community upvotes
- Integration with official emergency services APIs (112 India)

## 👨‍💻 Developer

Rohan Devadiga
KLE Technological University, Hubballi, Karnataka
Built for PromptWars Virtual — Hack2skill x Google for Developers, 2026

## Environment Variables

VITE_GEMINI_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DB_URL=your_db_url
