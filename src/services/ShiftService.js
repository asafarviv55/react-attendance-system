import api from './api';

class ShiftService {
  // Get all shifts
  async getAllShifts() {
    try {
      const response = await api.get('/shifts');
      return response.data;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }

  // Get shift by ID
  async getShiftById(shiftId) {
    try {
      const response = await api.get(`/shifts/${shiftId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shift:', error);
      throw error;
    }
  }

  // Create new shift
  async createShift(shiftData) {
    try {
      const response = await api.post('/shifts', shiftData);
      return response.data;
    } catch (error) {
      console.error('Error creating shift:', error);
      throw error;
    }
  }

  // Update shift
  async updateShift(shiftId, shiftData) {
    try {
      const response = await api.put(`/shifts/${shiftId}`, shiftData);
      return response.data;
    } catch (error) {
      console.error('Error updating shift:', error);
      throw error;
    }
  }

  // Delete shift
  async deleteShift(shiftId) {
    try {
      const response = await api.delete(`/shifts/${shiftId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
  }

  // Assign shift to user
  async assignShift(userId, shiftId, startDate, endDate) {
    try {
      const response = await api.post('/shifts/assign', {
        userId,
        shiftId,
        startDate,
        endDate,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning shift:', error);
      throw error;
    }
  }

  // Get user's shift schedule
  async getUserSchedule(userId, startDate, endDate) {
    try {
      const response = await api.get(`/shifts/schedule/${userId}`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user schedule:', error);
      throw error;
    }
  }

  // Get all schedules (admin/manager)
  async getAllSchedules(params = {}) {
    try {
      const { startDate, endDate, departmentId, shiftId } = params;
      const response = await api.get('/shifts/schedules', {
        params: { startDate, endDate, departmentId, shiftId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  // Request shift swap
  async requestShiftSwap(swapData) {
    try {
      const response = await api.post('/shifts/swap-request', swapData);
      return response.data;
    } catch (error) {
      console.error('Error requesting shift swap:', error);
      throw error;
    }
  }

  // Approve shift swap
  async approveShiftSwap(swapId) {
    try {
      const response = await api.put(`/shifts/swap/${swapId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving shift swap:', error);
      throw error;
    }
  }

  // Reject shift swap
  async rejectShiftSwap(swapId, reason) {
    try {
      const response = await api.put(`/shifts/swap/${swapId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting shift swap:', error);
      throw error;
    }
  }

  // Get shift conflicts
  async getShiftConflicts(userId, shiftId, date) {
    try {
      const response = await api.get('/shifts/conflicts', {
        params: { userId, shiftId, date },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking shift conflicts:', error);
      throw error;
    }
  }
}

export default new ShiftService();
