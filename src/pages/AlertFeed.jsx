import React from 'react';

function AlertFeed() {
  const mockAlerts = [
    { id: 1, type: 'Hazard', title: 'Road Blocked', description: 'Main street is blocked due to heavy rain.', time: '10 mins ago', severity: 'high' },
    { id: 2, type: 'Event', title: 'Community Gathering', description: 'Local festival starting at 5 PM.', time: '2 hours ago', severity: 'low' },
    { id: 3, type: 'Weather', title: 'Heavy Rain Warning', description: 'Expect severe thunderstorms in the area.', time: '4 hours ago', severity: 'medium' }
  ];

  return (
    <div className="page-container fade-in">
      <h2>Local Alerts</h2>
      <div className="alerts-list">
        {mockAlerts.map(alert => (
          <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
            <div className="alert-header">
              <span className="alert-type">{alert.type}</span>
              <span className="alert-time">{alert.time}</span>
            </div>
            <h3>{alert.title}</h3>
            <p>{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertFeed;
