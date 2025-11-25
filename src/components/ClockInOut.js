import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

const ClockInOut = () => {
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchTodayRecord();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayRecord = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await api.get('/attendance/reports', {
        params: { startDate: today, endDate: today }
      });
      if (response.data && response.data.length > 0) {
        setTodayRecord(response.data[0]);
      }
    } catch (error) {
      // Silently fail - user may not have attendance yet
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(new Error('Unable to get your location. Please enable location services.'))
      );
    });
  };

  const handleClockIn = async () => {
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const { latitude, longitude } = await getLocation();
      const response = await api.post('/attendance/clockin', {
        userId: auth.userId,
        latitude,
        longitude
      });
      setStatus({ message: response.data.message || 'Clocked in successfully!', type: 'success' });
      fetchTodayRecord();
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || error.message || 'Failed to clock in',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const { latitude, longitude } = await getLocation();
      const response = await api.post('/attendance/clockout', {
        userId: auth.userId,
        latitude,
        longitude
      });
      setStatus({ message: response.data.message || 'Clocked out successfully!', type: 'success' });
      fetchTodayRecord();
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || error.message || 'Failed to clock out',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const isClockedIn = todayRecord?.clockIn && !todayRecord?.clockOut;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Clock In / Out</h4>
            </div>
            <div className="card-body text-center">
              {/* Current Time Display */}
              <div className="mb-4">
                <h1 className="display-4">{format(currentTime, 'HH:mm:ss')}</h1>
                <p className="text-muted">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
              </div>

              {/* Status Alert */}
              {status.message && (
                <div className={`alert alert-${status.type} alert-dismissible`} role="alert">
                  {status.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setStatus({ message: '', type: '' })}
                  ></button>
                </div>
              )}

              {/* Today's Record */}
              {todayRecord && (
                <div className="mb-4 p-3 bg-light rounded">
                  <h6>Today's Record</h6>
                  <p className="mb-1">
                    <strong>Clock In:</strong>{' '}
                    {todayRecord.clockIn ? format(new Date(todayRecord.clockIn), 'HH:mm') : '-'}
                  </p>
                  <p className="mb-0">
                    <strong>Clock Out:</strong>{' '}
                    {todayRecord.clockOut ? format(new Date(todayRecord.clockOut), 'HH:mm') : '-'}
                  </p>
                </div>
              )}

              {/* Clock Buttons */}
              <div className="d-grid gap-3">
                <button
                  onClick={handleClockIn}
                  className="btn btn-success btn-lg"
                  disabled={loading || isClockedIn}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="fas fa-sign-in-alt me-2"></i>
                  )}
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  className="btn btn-danger btn-lg"
                  disabled={loading || !isClockedIn}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="fas fa-sign-out-alt me-2"></i>
                  )}
                  Clock Out
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-4">
                <span className={`badge ${isClockedIn ? 'bg-success' : 'bg-secondary'} fs-6`}>
                  {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockInOut;
