import React, { useEffect, useState, useMemo } from 'react';
import { database, analytics } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { logEvent } from 'firebase/analytics';

// Haversine formula to calculate distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

const AlertFeed = React.memo(function AlertFeed() {
  const [rawAlerts, setRawAlerts] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    // Get user browser geolocation
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError(true);
      }
    );
  }, []);

  // Log analytics when feed page loads
  useEffect(() => {
    logEvent(analytics, 'feed_viewed', { 
      timestamp: Date.now(),
      page: 'alert_feed'
    });
  }, []);

  useEffect(() => {
    if (!location) return;

    const alertsRef = ref(database, 'alerts');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRawAlerts([]);
        return;
      }
      
      const parsedAlerts = [];
      Object.keys(data).forEach(key => {
        const alertData = data[key];
        const dist = getDistance(location.lat, location.lng, alertData.lat, alertData.lng);
        // Filter alerts within 2km
        if (dist <= 2.0) {
          parsedAlerts.push({ id: key, ...alertData, distance: dist });
        }
      });
      
      setRawAlerts(parsedAlerts);
    });

    return () => unsubscribe();
  }, [location]);

  // Memoize sorted alerts for efficiency
  const alerts = useMemo(() => {
    const sorted = [...rawAlerts].sort((a, b) => a.distance - b.distance);
    return sorted;
  }, [rawAlerts]);

  // Log feed_viewed analytics event
  useEffect(() => {
    if (alerts.length > 0) {
      logEvent(analytics, 'feed_viewed', { alertCount: alerts.length });
    }
  }, [alerts.length]);

  return (
    <div className="page-container fade-in">
      <h2>Local Alerts (2km)</h2>
      {!location && !locationError && <p>Detecting your location...</p>}
      {locationError && <p>Please enable location services.</p>}
      <div className="alerts-list" role="feed" aria-label="Nearby alerts" aria-live="polite">
        {alerts.length === 0 && location && <p>No alerts nearby within 2km.</p>}
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
            <div className="alert-header">
              <span className="alert-type">{alert.hazardType}</span>
              <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()} ({alert.distance.toFixed(2)} km)</span>
            </div>
            <p>{alert.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default AlertFeed;
