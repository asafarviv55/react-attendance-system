import api from './api';

class DepartmentService {
  // Get all departments
  async getAllDepartments() {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // Get department by ID
  async getDepartmentById(departmentId) {
    try {
      const response = await api.get(`/departments/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  }

  // Create department
  async createDepartment(departmentData) {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  // Update department
  async updateDepartment(departmentId, departmentData) {
    try {
      const response = await api.put(`/departments/${departmentId}`, departmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  // Delete department
  async deleteDepartment(departmentId) {
    try {
      const response = await api.delete(`/departments/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }

  // Get department employees
  async getDepartmentEmployees(departmentId) {
    try {
      const response = await api.get(`/departments/${departmentId}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department employees:', error);
      throw error;
    }
  }

  // Assign employee to department
  async assignEmployee(departmentId, userId) {
    try {
      const response = await api.post(`/departments/${departmentId}/employees`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning employee to department:', error);
      throw error;
    }
  }

  // Remove employee from department
  async removeEmployee(departmentId, userId) {
    try {
      const response = await api.delete(`/departments/${departmentId}/employees/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing employee from department:', error);
      throw error;
    }
  }

  // Get department statistics
  async getDepartmentStats(departmentId) {
    try {
      const response = await api.get(`/departments/${departmentId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw error;
    }
  }

  // Get department attendance summary
  async getDepartmentAttendance(departmentId, startDate, endDate) {
    try {
      const response = await api.get(`/departments/${departmentId}/attendance`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching department attendance:', error);
      throw error;
    }
  }

  // Set department manager
  async setDepartmentManager(departmentId, managerId) {
    try {
      const response = await api.put(`/departments/${departmentId}/manager`, {
        managerId,
      });
      return response.data;
    } catch (error) {
      console.error('Error setting department manager:', error);
      throw error;
    }
  }
}

export default new DepartmentService();
