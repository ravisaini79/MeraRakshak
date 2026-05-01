import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';
import * as Device from 'expo-device';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on startup
    const loadToken = async () => {
      try {
        const token = await AuthService.getToken();
        if (token) {
          setUserToken(token);
          // Normally would fetch user profile here
        }
      } catch (e) {
        console.log('Failed to load token', e);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (data) => {
    setUserToken(data.token);
    setUser({
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role
    });
    if (data.token) {
      await AuthService.saveToken(data.token);
      // Automatically register this device
      await AuthService.registerDevice({
        deviceId: Device.osBuildId || 'unknown-id',
        name: Device.deviceName || 'Unknown Device',
        model: Device.modelName || 'Unknown Model',
      });
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    await AuthService.removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, userToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
