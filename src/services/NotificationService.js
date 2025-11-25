import api from './api';

class NotificationService {
  // Get user notifications
  async getUserNotifications(userId, params = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = params;
      const response = await api.get(`/notifications/user/${userId}`, {
        params: { page, limit, unreadOnly },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all as read
  async markAllAsRead(userId) {
    try {
      const response = await api.put(`/notifications/user/${userId}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Send notification
  async sendNotification(notificationData) {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(userIds, notificationData) {
    try {
      const response = await api.post('/notifications/bulk', {
        userIds,
        ...notificationData,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  // Get notification preferences
  async getPreferences(userId) {
    try {
      const response = await api.get(`/notifications/preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  // Update notification preferences
  async updatePreferences(userId, preferences) {
    try {
      const response = await api.put(`/notifications/preferences/${userId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Subscribe to push notifications
  async subscribeToPush(userId, subscription) {
    try {
      const response = await api.post('/notifications/push/subscribe', {
        userId,
        subscription,
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  // Show browser notification
  showBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

export default new NotificationService();
