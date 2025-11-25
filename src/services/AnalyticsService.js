import api from './api';

class AnalyticsService {
  // Get overall attendance analytics
  async getAttendanceAnalytics(params = {}) {
    try {
      const { startDate, endDate, departmentId, userId } = params;
      const response = await api.get('/analytics/attendance', {
        params: { startDate, endDate, departmentId, userId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
      throw error;
    }
  }

  // Get user performance metrics
  async getUserPerformance(userId, period = 'month') {
    try {
      const response = await api.get(`/analytics/performance/${userId}`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user performance:', error);
      throw error;
    }
  }

  // Get department analytics
  async getDepartmentAnalytics(departmentId, startDate, endDate) {
    try {
      const response = await api.get(`/analytics/department/${departmentId}`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching department analytics:', error);
      throw error;
    }
  }

  // Get attendance trends
  async getAttendanceTrends(params = {}) {
    try {
      const { period = 'month', departmentId } = params;
      const response = await api.get('/analytics/trends', {
        params: { period, departmentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance trends:', error);
      throw error;
    }
  }

  // Get late arrival statistics
  async getLateArrivalStats(params = {}) {
    try {
      const { startDate, endDate, departmentId } = params;
      const response = await api.get('/analytics/late-arrivals', {
        params: { startDate, endDate, departmentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching late arrival stats:', error);
      throw error;
    }
  }

  // Get early departure statistics
  async getEarlyDepartureStats(params = {}) {
    try {
      const { startDate, endDate, departmentId } = params;
      const response = await api.get('/analytics/early-departures', {
        params: { startDate, endDate, departmentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching early departure stats:', error);
      throw error;
    }
  }

  // Get absence statistics
  async getAbsenceStats(params = {}) {
    try {
      const { startDate, endDate, departmentId } = params;
      const response = await api.get('/analytics/absences', {
        params: { startDate, endDate, departmentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching absence stats:', error);
      throw error;
    }
  }

  // Get productivity metrics
  async getProductivityMetrics(params = {}) {
    try {
      const { userId, departmentId, period = 'month' } = params;
      const response = await api.get('/analytics/productivity', {
        params: { userId, departmentId, period },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching productivity metrics:', error);
      throw error;
    }
  }

  // Get dashboard summary
  async getDashboardSummary(userId, role) {
    try {
      const response = await api.get('/analytics/dashboard', {
        params: { userId, role },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // Get real-time attendance status
  async getRealTimeStatus() {
    try {
      const response = await api.get('/analytics/realtime-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time status:', error);
      throw error;
    }
  }

  // Export analytics report
  async exportReport(reportType, params = {}) {
    try {
      const response = await api.post(
        '/analytics/export',
        { reportType, ...params },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
