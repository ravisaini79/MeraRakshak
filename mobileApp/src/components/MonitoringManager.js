import React, { useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import * as Location from 'expo-location';
import { CameraView } from 'expo-camera';
import AppService from '../services/AppService';
import AuthService from '../services/AuthService';
import axios from 'axios';

const MonitoringManager = () => {
  const cameraRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const eventEmitter = new NativeEventEmitter(NativeModules.MonitoringModule);
    const subscription = eventEmitter.addListener('onProtectedAppOpen', async (event) => {
      console.log('Protected app opened:', event.packageName);
      // Optional: capture photo on open too? The prompt says "if correct PIN... optionally capture photo".
      // We'll focus on the failure case for now as requested.
    });

    const failureSubscription = eventEmitter.addListener('onLockFailure', async () => {
      console.log('Lock failed! Capturing intruder...');
      await handleProtectedAppUsage('Intruder Alert (Wrong PIN)');
    });

    return () => {
      subscription.remove();
      failureSubscription.remove();
    };
  }, []);

  const handleProtectedAppUsage = async (packageName) => {
    try {
      // 1. Get Location
      const { status } = await Location.requestForegroundPermissionsAsync();
      let location = null;
      if (status === 'granted') {
        const currentLoc = await Location.getCurrentPositionAsync({});
        location = {
          lat: currentLoc.coords.latitude,
          lng: currentLoc.coords.longitude
        };
      }

      // 2. Capture Image (Silent)
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
          skipProcessing: true
        });
        
        // 3. Upload to Backend
        if (photo.uri) {
          const formData = new FormData();
          formData.append('photo', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'app_open_snap.jpg',
          });
          formData.append('deviceId', 'MOBILE-APP');
          formData.append('type', 'APP_OPEN_ALERT');
          formData.append('message', `Protected app opened: ${packageName}`);
          formData.append('severity', 'WARNING');
          formData.append('location', JSON.stringify(location));

          const token = await AuthService.getToken();
          await axios.post(`${AuthService.getBaseUrl()}/api/security/log-event`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('App monitoring event saved successfully');
        }
      }
    } catch (error) {
      console.error('Error handling app usage event:', error);
    }
  };

  return (
    <CameraView
      ref={cameraRef}
      facing="front"
      style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
    />
  );
};

export default MonitoringManager;
