import api from './api';

class OvertimeService {
  // Get overtime records for a user
  async getUserOvertime(userId, params = {}) {
    try {
      const { startDate, endDate, status } = params;
      let url = `/overtime/user/${userId}?`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}&`;
      if (status) url += `status=${status}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user overtime:', error);
      throw error;
    }
  }

  // Get all overtime records (admin/manager)
  async getAllOvertime(params = {}) {
    try {
      const { page = 1, limit = 20, startDate, endDate, status, userId } = params;
      let url = `/overtime?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (status) url += `&status=${status}`;
      if (userId) url += `&userId=${userId}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching all overtime:', error);
      throw error;
    }
  }

  // Request overtime
  async requestOvertime(overtimeData) {
    try {
      const response = await api.post('/overtime/request', overtimeData);
      return response.data;
    } catch (error) {
      console.error('Error requesting overtime:', error);
      throw error;
    }
  }

  // Approve overtime request
  async approveOvertime(overtimeId, approverComments) {
    try {
      const response = await api.put(`/overtime/${overtimeId}/approve`, {
        approverComments,
      });
      return response.data;
    } catch (error) {
      console.error('Error approving overtime:', error);
      throw error;
    }
  }

  // Reject overtime request
  async rejectOvertime(overtimeId, approverComments) {
    try {
      const response = await api.put(`/overtime/${overtimeId}/reject`, {
        approverComments,
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting overtime:', error);
      throw error;
    }
  }

  // Calculate overtime hours
  calculateOvertimeHours(regularHours, actualHours, standardWorkHours = 8) {
    const overtime = actualHours - standardWorkHours;
    return overtime > 0 ? overtime : 0;
  }

  // Get overtime statistics
  async getOvertimeStats(userId, month, year) {
    try {
      const response = await api.get(`/overtime/stats/${userId}`, {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overtime stats:', error);
      throw error;
    }
  }

  // Calculate overtime pay
  calculateOvertimePay(overtimeHours, hourlyRate, overtimeMultiplier = 1.5) {
    return overtimeHours * hourlyRate * overtimeMultiplier;
  }

  // Get overtime summary report
  async getOvertimeSummary(params = {}) {
    try {
      const { startDate, endDate, departmentId } = params;
      const response = await api.get('/overtime/summary', {
        params: { startDate, endDate, departmentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overtime summary:', error);
      throw error;
    }
  }
}

export default new OvertimeService();
