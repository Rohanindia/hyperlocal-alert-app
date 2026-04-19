/**
 * ReportAlert Component
 * Problem: When emergencies happen, people have no fast way to warn neighbors.
 * Solution: User types a hazard description, Gemini AI classifies it automatically,
 * and the alert is broadcast in real time to everyone within 2km on a live map.
 * Uses: Gemini 2.0 Flash API, Firebase Realtime Database, Browser Geolocation API
 */
import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { classifyAlert } from '../utils/geminiService';

function ReportAlert() {
  const [formData, setFormData] = useState({ description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = formData.description;
    if (!description || description.trim().length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    setError('');
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

      // Log analytics event
      logEvent(analytics, 'alert_reported', {
        hazardType: aiData.hazardType,
        severity: aiData.severity
      });

      alert('Alert reported successfully!');
      setFormData({ description: '' });
    } catch (error) {
      console.error("Error creating alert:", error);
      setError('Error reporting alert. Please try again.');
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
              aria-label="Hazard description input"
            ></textarea>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading} aria-label="Submit alert">
            {loading ? 'Submitting...' : 'Submit Alert'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportAlert;
