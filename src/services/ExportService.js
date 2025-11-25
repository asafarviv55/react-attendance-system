import api from './api';
import { format } from 'date-fns';

class ExportService {
  // Export attendance to CSV
  exportToCSV(data, filename) {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ''}"`).join(',')
      ),
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  // Export attendance to Excel (via server)
  async exportToExcel(params) {
    try {
      const response = await api.post('/export/excel', params, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const filename = `attendance_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Export attendance to PDF (via server)
  async exportToPDF(params) {
    try {
      const response = await api.post('/export/pdf', params, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const filename = `attendance_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  // Export user report
  async exportUserReport(userId, startDate, endDate, format = 'pdf') {
    try {
      const response = await api.post(
        '/export/user-report',
        { userId, startDate, endDate, format },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const filename = `user_report_${userId}_${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Error exporting user report:', error);
      throw error;
    }
  }

  // Export department report
  async exportDepartmentReport(departmentId, startDate, endDate, format = 'pdf') {
    try {
      const response = await api.post(
        '/export/department-report',
        { departmentId, startDate, endDate, format },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const filename = `department_report_${departmentId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Error exporting department report:', error);
      throw error;
    }
  }

  // Export payroll data
  async exportPayroll(startDate, endDate, format = 'excel') {
    try {
      const response = await api.post(
        '/export/payroll',
        { startDate, endDate, format },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const filename = `payroll_${format(new Date(startDate), 'yyyy-MM')}.xlsx`;
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Error exporting payroll:', error);
      throw error;
    }
  }

  // Helper method to download file
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  // Helper method to download blob
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ExportService();
