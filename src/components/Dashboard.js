import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import '../styles/global.css';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    leaveDays: 0,
    pendingLeaves: 0,
    pendingCorrections: 0,
    averageHours: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      const [attendanceRes, leavesRes] = await Promise.all([
        api.get('/attendance/reports', { params: { startDate, endDate } }),
        api.get('/leave/requests').catch(() => ({ data: [] })),
      ]);

      const attendance = attendanceRes.data || [];
      const leaves = leavesRes.data || [];

      // Calculate stats
      const presentDays = attendance.filter(a => a.clockIn).length;
      const totalHours = attendance.reduce((sum, a) => {
        if (a.clockIn && a.clockOut) {
          const diff = new Date(a.clockOut) - new Date(a.clockIn);
          return sum + diff / (1000 * 60 * 60);
        }
        return sum;
      }, 0);

      setStats({
        totalDays: new Date().getDate(),
        presentDays,
        leaveDays: leaves.filter(l => l.status === 'approved').length,
        pendingLeaves: leaves.filter(l => l.status === 'pending').length,
        pendingCorrections: 0,
        averageHours: presentDays > 0 ? (totalHours / presentDays).toFixed(1) : 0,
      });

      setRecentAttendance(attendance.slice(-5).reverse());
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Welcome, {auth.userName}!</h2>

      {error && (
        <div className="alert alert-warning">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Present Days</h5>
              <h2>{stats.presentDays}</h2>
              <small>This month</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Leave Days</h5>
              <h2>{stats.leaveDays}</h2>
              <small>Approved</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Pending Leaves</h5>
              <h2>{stats.pendingLeaves}</h2>
              <small>Awaiting approval</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Avg Hours/Day</h5>
              <h2>{stats.averageHours}h</h2>
              <small>This month</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Recent Attendance</h5>
        </div>
        <div className="card-body">
          {recentAttendance.length === 0 ? (
            <p className="text-muted">No attendance records found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record, idx) => {
                    const hours = record.clockIn && record.clockOut
                      ? ((new Date(record.clockOut) - new Date(record.clockIn)) / (1000 * 60 * 60)).toFixed(1)
                      : '-';
                    return (
                      <tr key={idx}>
                        <td>{record.date || format(new Date(record.clockIn), 'yyyy-MM-dd')}</td>
                        <td>{record.clockIn ? format(new Date(record.clockIn), 'HH:mm') : '-'}</td>
                        <td>{record.clockOut ? format(new Date(record.clockOut), 'HH:mm') : '-'}</td>
                        <td>{hours}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
