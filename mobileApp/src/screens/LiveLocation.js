import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import BottomNav from '../components/BottomNav';
import AuthService from '../services/AuthService';
import * as Device from 'expo-device';

const { width, height } = Dimensions.get('window');

const LiveLocation = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AuthService.getLocationHistory(Device.osBuildId || 'unknown-id');
        setHistory(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // Sync every 10s
    return () => clearInterval(interval);
  }, []);

  const latestPoint = history[0];
  const initialRegion = latestPoint ? {
    latitude: latestPoint.lat,
    longitude: latestPoint.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Syncing satellites...</Text>
        </View>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {latestPoint && (
            <Marker
              coordinate={{ latitude: latestPoint.lat, longitude: latestPoint.lng }}
              title="Current Device"
              description={Device.deviceName || "My Phone"}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerPulse, { borderColor: COLORS.primary }]} />
                <View style={[styles.markerPin, { backgroundColor: COLORS.primary }]}>
                  <Text style={{ fontSize: 16 }}>📱</Text>
                </View>
              </View>
            </Marker>
          )}

          {history.length > 1 && (
            <Polyline
              coordinates={history.map(p => ({ latitude: p.lat, longitude: p.lng }))}
              strokeColor={COLORS.primary}
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>
      )}

      {/* Floating Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}><Text>🎯</Text></TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}><Text>🛰️</Text></TouchableOpacity>
      </View>

      {/* Mini Device Info Sheet */}
      <View style={styles.deviceSheet}>
        <View style={styles.dragBar} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Live Tracking</Text>
          <Text style={[styles.activeCount, history.length > 0 && { color: COLORS.success }]}>
            {history.length > 0 ? "Live" : "Offline"}
          </Text>
        </View>
        <View style={styles.miniList}>
          <MiniDevice 
            name={Device.deviceName || "This Device"} 
            icon="📱" 
            distance={latestPoint ? "Active Now" : "Searching..."} 
          />
        </View>
      </View>

      <BottomNav activeTab="Map" />
    </View>
  );
};

const MiniDevice = ({ name, icon, distance }) => (
  <View style={styles.miniItem}>
    <View style={styles.miniAvatar}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.miniName}>{name}</Text>
      <Text style={styles.miniDist}>{distance}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: 15,
    color: COLORS.primary,
    fontWeight: '700',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    opacity: 0.4,
  },
  controls: {
    position: 'absolute',
    right: SPACING.lg,
    top: 60,
  },
  controlBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...SHADOWS.md,
  },
  deviceSheet: {
    position: 'absolute',
    bottom: 85,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: SPACING.lg,
    paddingBottom: 20,
    ...SHADOWS.lg,
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.light.text,
  },
  activeCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    fontWeight: '700',
  },
  miniList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  miniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  miniName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  miniDist: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
});

export default LiveLocation;
