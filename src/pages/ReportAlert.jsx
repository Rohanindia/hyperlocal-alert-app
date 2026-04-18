import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

async function classifyAlert(description) {
  const apiKey = "AIzaSyC7RG4whNxdkWWGNvS3bfxDCcuCGa9O4BA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt = `Analyze this hazard report and respond with ONLY a JSON object (no markdown, no explanation): {"hazardType": "flood/fire/accident/crime/weather/other", "severity": "low/medium/critical", "summary": "max 20 words"} Hazard report: ${description}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await response.json();
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Gemini API returned no candidates: ' + JSON.stringify(data));
  }
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function ReportAlert() {
  const [formData, setFormData] = useState({ description: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) return;
    setLoading(true);

    try {
      // Get GeoLocation
      let lat = 12.9716;
      let lng = 77.5946;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (geoError) {
        console.warn("Geolocation failed, using default Bangalore coordinates.", geoError);
      }

      const aiData = await classifyAlert(formData.description);

      // Save to Firebase Realtime Database
      const alertsRef = ref(database, 'alerts');
      await push(alertsRef, {
        lat,
        lng,
        hazardType: aiData.hazardType,
        severity: aiData.severity.toLowerCase(),
        summary: aiData.summary,
        timestamp: Date.now()
      });

      alert('Alert reported successfully!');
      setFormData({ description: '' });
    } catch (error) {
      console.error("Error creating alert:", error);
      alert('Error reporting alert. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container slide-up">
      <h2>Report an Issue</h2>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Hazard Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the hazard (e.g. Broken water pipe on Main St, flooding the road...)"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing via AI & Location...' : 'Submit Alert'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportAlert;
