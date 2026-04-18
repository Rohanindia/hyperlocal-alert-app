import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

// Component to dynamically update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function MapView() {
  const [center, setCenter] = useState([51.505, -0.09]); // Default fallback
  const [alerts, setAlerts] = useState([]);
  const [locationFound, setLocationFound] = useState(false);

  useEffect(() => {
    // Get user browser geolocation
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setLocationFound(true);
      },
      (error) => {
        console.error("Map geolocation error:", error);
      }
    );

    // Listen to Firebase Realtime DB alerts
    const alertsRef = ref(database, 'alerts');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setAlerts([]);
        return;
      }
      
      const parsedAlerts = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      setAlerts(parsedAlerts);
    });

    return () => unsubscribe();
  }, []);

  const getMarkerColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="page-container full-height fade-in">
      <h2 className="map-title">Incident Map</h2>
      <div className="map-wrapper">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locationFound && <MapUpdater center={center} />}
          
          {locationFound && (
            <CircleMarker 
              center={center} 
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1 }} 
              radius={6}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}

          {alerts.map((alert) => (
            <CircleMarker 
              key={alert.id}
              center={[alert.lat, alert.lng]} 
              pathOptions={{ 
                color: getMarkerColor(alert.severity),
                fillColor: getMarkerColor(alert.severity),
                fillOpacity: 0.8,
                weight: 2
              }} 
              radius={10}
            >
              <Popup>
                <div style={{ margin: 0, padding: 0 }}>
                  <strong style={{ textTransform: 'uppercase' }}>{alert.hazardType}</strong>
                  <p style={{ margin: '5px 0' }}>{alert.summary}</p>
                  <small style={{ color: 'gray' }}>{new Date(alert.timestamp).toLocaleTimeString()}</small>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
