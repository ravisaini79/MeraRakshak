import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AuthService = {
  login: async (email, password) => {
    console.log('Logging in:', email);
    const response = await axios.post(`${API_URL}/auth/register`.replace('register', 'login'), { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    console.log('Registering user:', userData.email);
    console.log('Using API URL:', `${API_URL}/auth/register`);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getDevices: async () => {
    const user = AuthService.getCurrentUser();
    console.log('Fetching devices for:', user?.email);
    const response = await axios.get(`${API_URL}/devices`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    return response.data;
  },

  getSecurityEvents: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/security/events`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    return response.data;
  },

  getAdminStats: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    return response.data;
  },

  getAdminUsers: async () => {
    const user = AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    return response.data;
  },
  
  toggleBlockUser: async (userId) => {
    const user = AuthService.getCurrentUser();
    const response = await axios.put(`${API_URL}/admin/block-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    return response.data;
  }
};

export default AuthService;
