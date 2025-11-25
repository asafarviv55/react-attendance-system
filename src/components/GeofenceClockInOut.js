import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GeofencingService from '../services/GeofencingService';
import '../styles/GeofenceClockInOut.css';

const GeofenceClockInOut = () => {
  const { auth } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [withinGeofence, setWithinGeofence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    loadLocations();
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (currentPosition && selectedLocation) {
      checkGeofence();
    }
  }, [currentPosition, selectedLocation]);

  const loadLocations = async () => {
    try {
      const data = await GeofencingService.getAllLocations();
      setLocations(data);
    } catch (error) {
      setMessage('Error loading locations: ' + error.message);
    }
  };

  const getCurrentPosition = async () => {
    try {
      const position = await GeofencingService.getCurrentPosition();
      setCurrentPosition(position);
    } catch (error) {
      setMessage('Error getting location: ' + error.message);
    }
  };

  const checkGeofence = async () => {
    try {
      const location = locations.find((loc) => loc.id === selectedLocation);
      if (!location) return;

      const dist = GeofencingService.calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        location.latitude,
        location.longitude
      );

      setDistance(Math.round(dist));
      setWithinGeofence(dist <= location.radius);
    } catch (error) {
      console.error('Error checking geofence:', error);
    }
  };

  const handleClockIn = async () => {
    if (!withinGeofence) {
      setMessage('You must be within the geofence to clock in');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await GeofencingService.clockInWithLocation(auth.userId, selectedLocation);
      setMessage('Successfully clocked in!');
    } catch (error) {
      setMessage('Error clocking in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!withinGeofence) {
      setMessage('You must be within the geofence to clock out');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await GeofencingService.clockOutWithLocation(auth.userId, selectedLocation);
      setMessage('Successfully clocked out!');
    } catch (error) {
      setMessage('Error clocking out: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="geofence-clock-container">
      <div className="geofence-card">
        <h2>Location-Based Clock In/Out</h2>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label>Select Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="form-control"
          >
            <option value="">Choose a location...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} - {loc.address}
              </option>
            ))}
          </select>
        </div>

        {currentPosition && (
          <div className="location-info">
            <h3>Your Current Location:</h3>
            <p>
              Latitude: {currentPosition.latitude.toFixed(6)}<br />
              Longitude: {currentPosition.longitude.toFixed(6)}<br />
              Accuracy: ±{currentPosition.accuracy.toFixed(0)}m
            </p>
          </div>
        )}

        {distance !== null && selectedLocation && (
          <div className={`geofence-status ${withinGeofence ? 'within' : 'outside'}`}>
            <div className="status-icon">
              {withinGeofence ? '✓' : '✗'}
            </div>
            <div className="status-text">
              <strong>{withinGeofence ? 'Within Geofence' : 'Outside Geofence'}</strong>
              <p>Distance: {distance}m from location</p>
            </div>
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handleClockIn}
            disabled={loading || !withinGeofence || !selectedLocation}
            className="btn btn-clock-in"
          >
            {loading ? 'Processing...' : 'Clock In'}
          </button>
          <button
            onClick={handleClockOut}
            disabled={loading || !withinGeofence || !selectedLocation}
            className="btn btn-clock-out"
          >
            {loading ? 'Processing...' : 'Clock Out'}
          </button>
        </div>

        <button
          onClick={getCurrentPosition}
          className="btn btn-refresh"
          disabled={loading}
        >
          Refresh Location
        </button>
      </div>
    </div>
  );
};

export default GeofenceClockInOut;
