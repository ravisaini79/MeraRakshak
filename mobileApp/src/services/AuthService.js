import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://merarakshak.onrender.com'; // Updated for production connectivity

const AuthService = {
  getBaseUrl() {
    return API_URL;
  },
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      const responseData = response.data.response || response.data;
      if (responseData.token) {
        await this.saveToken(responseData.token);
      }
      return responseData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const responseData = response.data.response || response.data;
      if (responseData.token) {
        await this.saveToken(responseData.token);
      }
      return responseData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  async saveToken(token) {
    await SecureStore.setItemAsync('userToken', token);
  },

  async getToken() {
    return await SecureStore.getItemAsync('userToken');
  },

  async removeToken() {
    await SecureStore.deleteItemAsync('userToken');
  },

  async registerDevice(deviceData) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${API_URL}/api/devices`, deviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      console.error('Device registration failed', error);
    }
  },

  async getDevices() {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${API_URL}/api/devices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch devices';
    }
  },

  async sendLocation(locationData) {
    try {
      const token = await this.getToken();
      await axios.post(`${API_URL}/api/location`, locationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to send location', error);
    }
  },

  async getLocationHistory(deviceId) {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${API_URL}/api/location/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch location history';
    }
  },

  async createFamily(name) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${API_URL}/api/family`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create family';
    }
  },

  async inviteMember(groupId, email) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${API_URL}/api/family/invite`, { groupId, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to invite member';
    }
  },

  async getFamilyMembers() {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${API_URL}/api/family/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch family members';
    }
  },

  async reportTheft(deviceId) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${API_URL}/api/security/report-theft`, { deviceId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to report theft';
    }
  },

  async getSecurityEvents() {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${API_URL}/api/security/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch security events';
    }
  },

  async logSecurityEvent(eventData) {
    try {
      const token = await this.getToken();
      
      // Handle optional image upload using FormData if photo photo is present
      let data = eventData;
      let headers = { Authorization: `Bearer ${token}` };

      if (eventData.photo) {
        data = new FormData();
        Object.keys(eventData).forEach(key => data.append(key, eventData[key]));
        headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await axios.post(`${API_URL}/api/security/log-event`, data, { headers });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to log security event';
    }
  },

  async registerPushToken(token) {
    try {
      const authToken = await this.getToken();
      await axios.post(`${API_URL}/register-push-token`, { token }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.error('Push token registration failed:', error);
    }
  },

  async getNotifications() {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch notifications';
    }
  }
};

export default AuthService;
