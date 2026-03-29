import { View, StyleSheet, ActivityIndicator, Platform, Alert, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import SplashScreen from './screens/Splash';
import Onboarding from './screens/Onboarding';
import LoginSignup from './screens/LoginSignup';
import Dashboard from './screens/Dashboard';
import AppSelector from './screens/AppSelector';
import CapturedImages from './screens/CapturedImages';
import MapTracking from './screens/MapTracking';
import SecurityTimeline from './screens/SecurityTimeline';
import MonitoringManager from './components/MonitoringManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { COLORS } from './theme/Theme';
import AuthService from './services/AuthService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppContent = () => {
  const { userToken, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('Splash');

  useEffect(() => {
    let trackingInterval;

    if (userToken) {
      // 1. Setup Notifications
      registerForPushNotificationsAsync().then(token => {
        if (token) AuthService.registerPushToken(token);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification Response:', response);
      });

      // 2. Location tracking
      const startTracking = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        trackingInterval = setInterval(async () => {
          try {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            await AuthService.sendLocation({
              deviceId: Device.osBuildId || 'unknown-id',
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            });
          } catch (err) {
            console.warn('Tracking error:', err);
          }
        }, 30000); // 30 seconds to be battery friendly
      };

      startTracking();

      return () => {
        if (trackingInterval) clearInterval(trackingInterval);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  }, [userToken]);

  const navigate = (screen) => setCurrentScreen(screen);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: '#FFF' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: COLORS.light.background }}>
        <StatusBar barStyle="light-content" />
        <MonitoringManager />
        {currentScreen === 'AppSelector' && (
          <AppSelector onBack={() => navigate('Dashboard')} />
        )}
        {currentScreen === 'CapturedImages' && (
          <CapturedImages onBack={() => navigate('Dashboard')} />
        )}
        {currentScreen === 'MapTracking' && (
          <MapTracking onBack={() => navigate('Dashboard')} />
        )}
        {currentScreen === 'SecurityTimeline' && (
          <SecurityTimeline onBack={() => navigate('Dashboard')} />
        )}
        {currentScreen === 'Dashboard' && (
          <Dashboard onNavigate={navigate} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: COLORS.light.background }}>
      <StatusBar barStyle="dark-content" />
      <MonitoringManager />
      {currentScreen === 'Splash' && (
        <SplashScreen onFinish={() => navigate('Onboarding')} />
      )}

      {currentScreen === 'Onboarding' && (
        <Onboarding onComplete={() => navigate('Login')} />
      )}

      {currentScreen === 'Login' && (
        <LoginSignup />
      )}
    </View>
  </GestureHandlerRootView>
);


async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } catch (e) {
      console.log('Error getting push token', e);
    }
  }

  return token;
}

const Main = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Main;
