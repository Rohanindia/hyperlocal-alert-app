import React, { useState } from 'react';

function ReportAlert() {
  const [formData, setFormData] = useState({ title: '', type: 'hazard', description: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alert reported (Mock)');
  };

  return (
    <div className="page-container slide-up">
      <h2>Report an Issue</h2>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="What's happening?" required />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="hazard">Hazard / Danger</option>
              <option value="weather">Weather condition</option>
              <option value="event">Local Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Provide more details..." required></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Submit Alert</button>
        </form>
      </div>
    </div>
  );
}

export default ReportAlert;
