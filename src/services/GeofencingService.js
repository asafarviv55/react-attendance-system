import api from './api';

class GeofencingService {
  // Get user's current position
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Check if user is within geofence
  async isWithinGeofence(latitude, longitude, locationId) {
    try {
      const response = await api.post('/geofence/verify', {
        latitude,
        longitude,
        locationId,
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying geofence:', error);
      throw error;
    }
  }

  // Clock in with location verification
  async clockInWithLocation(userId, locationId) {
    try {
      const position = await this.getCurrentPosition();
      const response = await api.post('/attendance/clock-in-location', {
        userId,
        locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      });
      return response.data;
    } catch (error) {
      console.error('Error clocking in with location:', error);
      throw error;
    }
  }

  // Clock out with location verification
  async clockOutWithLocation(userId, locationId) {
    try {
      const position = await this.getCurrentPosition();
      const response = await api.post('/attendance/clock-out-location', {
        userId,
        locationId,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      });
      return response.data;
    } catch (error) {
      console.error('Error clocking out with location:', error);
      throw error;
    }
  }

  // Get all geofence locations
  async getAllLocations() {
    try {
      const response = await api.get('/geofence/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  // Add new geofence location
  async addLocation(locationData) {
    try {
      const response = await api.post('/geofence/locations', locationData);
      return response.data;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  // Update geofence location
  async updateLocation(locationId, locationData) {
    try {
      const response = await api.put(`/geofence/locations/${locationId}`, locationData);
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  // Delete geofence location
  async deleteLocation(locationId) {
    try {
      const response = await api.delete(`/geofence/locations/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }
}

export default new GeofencingService();
