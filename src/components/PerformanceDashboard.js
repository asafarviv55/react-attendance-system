import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AnalyticsService from '../services/AnalyticsService';
import '../styles/PerformanceDashboard.css';

const PerformanceDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    loadPerformance();
  }, [period]);

  const loadPerformance = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsService.getUserPerformance(auth.userId, period);
      setPerformance(data);
    } catch (error) {
      console.error('Error loading performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading performance data...</div>;
  }

  if (!performance) {
    return <div className="error">Failed to load performance data</div>;
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h2>Performance Dashboard</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="period-selector"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon attendance">📊</div>
          <div className="metric-content">
            <h3>Attendance Rate</h3>
            <p className="metric-value">{performance.attendanceRate}%</p>
            <span className="metric-label">Days present / Total days</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon punctuality">⏰</div>
          <div className="metric-content">
            <h3>Punctuality Score</h3>
            <p className="metric-value">{performance.punctualityScore}%</p>
            <span className="metric-label">On-time arrivals</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon hours">🕐</div>
          <div className="metric-content">
            <h3>Total Hours</h3>
            <p className="metric-value">{performance.totalHours}h</p>
            <span className="metric-label">Regular: {performance.regularHours}h</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon overtime">⚡</div>
          <div className="metric-content">
            <h3>Overtime</h3>
            <p className="metric-value">{performance.overtimeHours}h</p>
            <span className="metric-label">Extra hours worked</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon leaves">🏖️</div>
          <div className="metric-content">
            <h3>Leaves Taken</h3>
            <p className="metric-value">{performance.leavesTaken}</p>
            <span className="metric-label">Out of {performance.totalLeavesAllowed}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon absences">❌</div>
          <div className="metric-content">
            <h3>Absences</h3>
            <p className="metric-value">{performance.absences}</p>
            <span className="metric-label">Unauthorized absences</span>
          </div>
        </div>
      </div>

      <div className="performance-chart">
        <h3>Attendance Trend</h3>
        <div className="trend-bars">
          {performance.weeklyTrend?.map((week, index) => (
            <div key={index} className="trend-bar">
              <div
                className="bar-fill"
                style={{ height: `${week.percentage}%` }}
              ></div>
              <span className="bar-label">W{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="performance-details">
        <div className="detail-section">
          <h3>Strengths</h3>
          <ul>
            {performance.strengths?.map((strength, index) => (
              <li key={index} className="strength-item">
                ✓ {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <h3>Areas for Improvement</h3>
          <ul>
            {performance.improvements?.map((improvement, index) => (
              <li key={index} className="improvement-item">
                • {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
