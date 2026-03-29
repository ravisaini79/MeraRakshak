import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import AppService from '../services/AppService';

const MapTracking = ({ onBack }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    let subscription;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required for map tracking.');
          setLoading(false);
          return;
        }

        // 1. Get initial location
        const initialLoc = await Location.getCurrentPositionAsync({});
        const locData = {
          latitude: initialLoc.coords.latitude,
          longitude: initialLoc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setCurrentLocation(locData);

        // 2. Fetch History
        const locHistory = await AppService.getLocationHistory();
        setHistory(locHistory);

        // 3. Start real-time watch
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          (location) => {
            const newLoc = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCurrentLocation(prev => ({ ...prev, ...newLoc }));
            // Sync with backend
            AppService.sendLocation(newLoc.latitude, newLoc.longitude).catch(e => console.log('Sync error:', e));
          }
        );

      } catch (error) {
        console.error('Error starting map tracking:', error);
      } finally {
        setLoading(false);
      }
    };

    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const centerMap = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(currentLocation, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Live Tracking" 
        leftIcon={<Text style={{ fontSize: 20 }}>←</Text>} 
        onLeftPress={onBack} 
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10 }}>Initializing map...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={currentLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Your Device"
                description="Live Location"
              />
            )}

            {history.length > 0 && (
              <Polyline
                coordinates={history.map(h => ({ latitude: h.lat, longitude: h.lng }))}
                strokeColor={COLORS.primary}
                strokeWidth={3}
              />
            )}

            {history.length > 0 && history[0] && (
              <Marker
                coordinate={{ latitude: history[0].lat, longitude: history[0].lng }}
                pinColor="blue"
                title="Last Known Location"
              />
            )}
          </MapView>

          <TouchableOpacity style={styles.fab} onPress={centerMap}>
            <Text style={{ fontSize: 24 }}>🎯</Text>
          </TouchableOpacity>

          <View style={styles.statusPanel}>
             <Text style={styles.statusTitle}>Device Status</Text>
             <Text style={styles.statusText}>
               {currentLocation ? `Live: ${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}` : 'Waiting for GPS...'}
             </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#FFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: SPACING.md,
    elevation: 4,
  },
  statusTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 4,
  }
});

export default MapTracking;
