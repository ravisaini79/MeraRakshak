import axios from 'axios';

const API_URL = '/api';

const AuthService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getDevices: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/devices`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  },

  getSecurityEvents: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/security/events`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  },

  getAdminStats: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  },

  getAdminUsers: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  },
  
  toggleBlockUser: async (userId) => {
    const user = AuthService.getCurrentUser();
    const response = await axios.put(`${API_URL}/admin/block-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  }
};

export default AuthService;
