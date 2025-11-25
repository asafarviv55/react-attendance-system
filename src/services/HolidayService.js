import api from './api';

class HolidayService {
  // Get all holidays
  async getAllHolidays(year) {
    try {
      const response = await api.get('/holidays', { params: { year } });
      return response.data;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  }

  // Get holiday by ID
  async getHolidayById(holidayId) {
    try {
      const response = await api.get(`/holidays/${holidayId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching holiday:', error);
      throw error;
    }
  }

  // Create holiday
  async createHoliday(holidayData) {
    try {
      const response = await api.post('/holidays', holidayData);
      return response.data;
    } catch (error) {
      console.error('Error creating holiday:', error);
      throw error;
    }
  }

  // Update holiday
  async updateHoliday(holidayId, holidayData) {
    try {
      const response = await api.put(`/holidays/${holidayId}`, holidayData);
      return response.data;
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  }

  // Delete holiday
  async deleteHoliday(holidayId) {
    try {
      const response = await api.delete(`/holidays/${holidayId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  }

  // Check if date is holiday
  async isHoliday(date) {
    try {
      const response = await api.get('/holidays/check', { params: { date } });
      return response.data;
    } catch (error) {
      console.error('Error checking holiday:', error);
      throw error;
    }
  }

  // Get upcoming holidays
  async getUpcomingHolidays(limit = 5) {
    try {
      const response = await api.get('/holidays/upcoming', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming holidays:', error);
      throw error;
    }
  }

  // Import holidays from external source
  async importHolidays(year, country = 'US') {
    try {
      const response = await api.post('/holidays/import', { year, country });
      return response.data;
    } catch (error) {
      console.error('Error importing holidays:', error);
      throw error;
    }
  }

  // Get holidays by date range
  async getHolidaysByDateRange(startDate, endDate) {
    try {
      const response = await api.get('/holidays/range', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching holidays by date range:', error);
      throw error;
    }
  }

  // Get working days count (excluding holidays and weekends)
  async getWorkingDaysCount(startDate, endDate) {
    try {
      const response = await api.get('/holidays/working-days', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating working days:', error);
      throw error;
    }
  }
}

export default new HolidayService();
