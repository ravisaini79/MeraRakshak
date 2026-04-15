import { NativeModules, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const { RNAndroidInstalledApps, MonitoringModule } = NativeModules;

// We'll use react-native-launcher-kit for real app listing
// Fallback to empty if not installed or not Android
let InstalledApps = null;
try {
  const LauncherKit = require('react-native-launcher-kit');
  InstalledApps = LauncherKit.InstalledApps;
} catch (e) {
  // Library not installed yet
}

const MOCK_APPS = [
  { id: '1', name: 'WhatsApp', icon: '💬', package: 'com.whatsapp' },
  { id: '2', name: 'Facebook', icon: '👤', package: 'com.facebook.katana' },
  { id: '3', name: 'Instagram', icon: '📸', package: 'com.instagram.android' },
  { id: '4', name: 'Gmail', icon: '✉️', package: 'com.google.android.gm' },
  { id: '5', name: 'YouTube', icon: '📺', package: 'com.google.android.youtube' },
  { id: '6', name: 'Banking App', icon: '🏦', package: 'com.bank.secure' },
  { id: '7', name: 'Photos', icon: '🖼️', package: 'com.google.android.apps.photos' },
  { id: '8', name: 'Settings', icon: '⚙️', package: 'com.android.settings' },
];

const SELECTED_APPS_KEY = 'protected_apps';

const AppService = {
  async getInstalledApps() {
    if (Platform.OS === 'android' && InstalledApps) {
      try {
        const apps = await InstalledApps.getSortedApps();
        // react-native-launcher-kit returns { label, packageName, icon }
        return apps.map((app, index) => ({
          id: app.packageName || `app-${index}`,
          name: app.label || 'Unknown App',
          icon: '📱', 
          package: app.packageName
        }));
      } catch (error) {
        console.error('Failed to fetch native apps', error);
        return MOCK_APPS;
      }
    }
    // Fallback for iOS or if native module is missing
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_APPS), 800);
    });
  },

  async saveSelectedApps(apps) {
    try {
      const data = JSON.stringify(apps);
      await SecureStore.setItemAsync(SELECTED_APPS_KEY, data);
    } catch (error) {
      console.error('Failed to save selected apps', error);
      throw error;
    }
  },

  async getSelectedApps() {
    try {
      const data = await SecureStore.getItemAsync(SELECTED_APPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get selected apps', error);
      return [];
    }
  },

  async syncMonitoring() {
    if (Platform.OS === 'android' && MonitoringModule) {
      try {
        const selectedApps = await this.getSelectedApps();
        const packageNames = selectedApps.map(app => app.package);
        if (packageNames.length > 0) {
          MonitoringModule.startMonitoring(packageNames);
        } else {
          MonitoringModule.stopMonitoring();
        }
      } catch (error) {
        console.error('Failed to sync monitoring', error);
      }
    }
  },

  async setMasterPin(pin) {
    try {
      await SecureStore.setItemAsync('master_pin', pin);
      if (Platform.OS === 'android' && MonitoringModule) {
        MonitoringModule.setMasterPin(pin);
      }
    } catch (error) {
      console.error('Failed to set master pin', error);
    }
  },

  async getMasterPin() {
    try {
      return await SecureStore.getItemAsync('master_pin') || '1234';
    } catch (error) {
      return '1234';
    }
  },

  async sendLocation(lat, lng) {
    try {
      const token = await AuthService.getToken();
      // For now using a hardcoded deviceId or fetching it from DeviceInfo
      const response = await axios.post(`${AuthService.getBaseUrl()}/api/location`, {
        deviceId: 'MOBILE-APP',
        lat,
        lng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      console.error('Failed to send location', error);
      throw error;
    }
  },

  async getLocationHistory() {
    try {
      const token = await AuthService.getToken();
      const response = await axios.get(`${AuthService.getBaseUrl()}/api/location/MOBILE-APP`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      console.error('Failed to get location history', error);
      return [];
    }
  },

  async getSecurityTimeline() {
    try {
      const [events, locations] = await Promise.all([
        this.getSecurityEvents(),
        this.getLocationHistory()
      ]);

      const timeline = [
        ...events.map(e => ({ ...e, timelineType: 'EVENT' })),
        ...locations.map(l => ({ ...l, timelineType: 'LOCATION', message: 'Location Update' }))
      ];

      return timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Failed to get security timeline', error);
      return [];
    }
  },

  async getSecurityEvents() {
    try {
      const token = await AuthService.getToken();
      const response = await axios.get(`${AuthService.getBaseUrl()}/api/security/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.response || response.data;
    } catch (error) {
      console.error('Failed to get security events', error);
      return [];
    }
  }
};

export default AppService;
