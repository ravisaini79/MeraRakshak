import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AuthService from '../services/AuthService';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const fetchDevices = async () => {
    try {
      const data = await AuthService.getDevices();
      setDevices(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => clearInterval(interval);
  }, []);

  const handleTriggerAlarm = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Required", "Camera access is needed for security snapshots.");
      return;
    }

    try {
      Alert.alert("Alarm Triggered", "Capturing intruder snapshot and notifying family...");
      
      let photoData = null;
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        photoData = `data:image/jpg;base64,${photo.base64}`;
      }

      await AuthService.logSecurityEvent({
        deviceId: 'local-device', // Mock
        type: 'INTRUDER_ALERT',
        message: 'Manual alarm triggered from dashboard. Snapshot captured.',
        severity: 'CRITICAL',
        photo: photoData
      });

    } catch (err) {
      console.error('Trigger alarm error:', err);
    }
  };

  const handleReportTheft = async (deviceId) => {
    Alert.alert(
      "Report Stolen?",
      "This will trigger high-intensity tracking and notify your family group.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report Stolen", 
          style: "destructive",
          onPress: async () => {
            try {
              await AuthService.reportTheft(deviceId);
              Alert.alert("Success", "Theft Mode Activated");
              fetchDevices();
            } catch (err) {
              Alert.alert("Error", err);
            }
          }
        }
      ]
    );
  };

  const isAnyDeviceStolen = devices.some(d => d.status === 'Stolen');

  return (
    <View style={styles.container}>
      {/* Hidden Camera for background capture */}
      {hasPermission && (
        <View style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}>
          <Camera ref={cameraRef} style={{ height: 1, width: 1 }} type={Camera.Constants.Type.front} />
        </View>
      )}

      <Header title="SafeSpace" showNotification />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isAnyDeviceStolen && (
          <View style={styles.theftBanner}>
            <Text style={styles.theftIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.theftTitle}>THEFT MODE ACTIVE</Text>
              <Text style={styles.theftDesc}>High-intensity tracking is currently active for your stolen device.</Text>
            </View>
          </View>
        )}

        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{isAnyDeviceStolen ? "Security Alert Active" : "All Family Members Safe"}</Text>
          </View>
          <Text style={styles.updateTime}>System Integrity: Verified</Text>
        </Card>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionBtn title="Track" icon="📍" color="#6366F1" />
          <ActionBtn title="Alarm" icon="🔔" color="#EF4444" onPress={handleTriggerAlarm} />
          <ActionBtn title="Lock" icon="🔒" color="#1E293B" />
          <ActionBtn title="Ring" icon="🔊" color="#10B981" />
        </View>

        <Text style={styles.sectionTitle}>Tracked Devices</Text>
        <Text style={styles.helperText}>Long press an active device to report it as stolen.</Text>
        
        {devices.length > 0 ? (
          devices.map((device, idx) => (
            <DeviceItem 
              key={device.deviceId || idx} 
              name={device.name} 
              status={device.status === 'Stolen' ? "🚨 STOLEN • Tracking" : `Active • ${device.model}`} 
              onLongPress={() => device.status !== 'Stolen' && handleReportTheft(device.deviceId)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices connected.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>Manage All Devices</Text>
        </TouchableOpacity>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav activeTab="Home" />
    </View>
  );
};

const ActionBtn = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Text style={styles.iconTxt}>{icon}</Text>
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

const DeviceItem = ({ name, status, onLongPress }) => (
  <TouchableOpacity onLongPress={onLongPress} activeOpacity={0.7}>
    <Card style={styles.deviceRow}>
      <View style={styles.deviceInfo}>
        <View style={styles.deviceIconBox}>
          <Text style={{ fontSize: 20 }}>📱</Text>
        </View>
        <View>
          <Text style={styles.deviceName}>{name}</Text>
          <Text style={[styles.deviceDesc, status.includes('STOLEN') && { color: COLORS.danger, fontWeight: '700' }]}>
            {status}
          </Text>
        </View>
      </View>
      <View style={styles.chevron} />
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statusCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderRadius: 24,
    ...SHADOWS.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ADFF2F',
    marginRight: 10,
  },
  statusText: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    fontWeight: '800',
  },
  updateTime: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
    marginBottom: 12,
    marginTop: 8,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.md,
  },
  iconTxt: {
    fontSize: 24,
  },
  actionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.text,
    fontWeight: '700',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: 16,
    borderRadius: 20,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deviceName: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.light.text,
  },
  deviceDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 2,
  },
  viewAllBtn: {
    alignItems: 'center',
    padding: SPACING.md,
    marginTop: 8,
  },
  viewAllText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    fontStyle: 'italic',
  },
  theftBanner: {
    backgroundColor: COLORS.danger,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.lg,
  },
  theftIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  theftTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
    fontSize: 14,
  },
  theftDesc: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
    lineHeight: 18,
  },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#CBD5E1',
    transform: [{ rotate: '45deg' }],
  }
});

export default Dashboard;
