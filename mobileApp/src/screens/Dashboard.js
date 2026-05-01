import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import SecuritySlider from '../components/SecuritySlider';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, GRADIENTS } from '../theme/Theme';

const { width } = Dimensions.get('window');

const Dashboard = ({ onNavigate }) => {
  const [isSecure, setIsSecure] = useState(true);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedShieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    opacity: 1 / pulseValue.value
  }));

  const handleSOS = () => {
    console.log('SOS Triggered');
    setIsSecure(false);
    setTimeout(() => setIsSecure(true), 5000);
  };

  const widgets = [
    { 
      id: 'protection', 
      title: 'App Protection', 
      sub: 'Secure your sensitive apps', 
      icon: '🛡️', 
      screen: 'AppSelector',
      color: ['#6366F1', '#4F46E5'],
      bg: '#EEF2FF'
    },
    { 
      id: 'gallery', 
      title: 'Captured Images', 
      sub: 'View security snapshots', 
      icon: '📸', 
      screen: 'CapturedImages',
      color: ['#0EA5E9', '#0284C7'],
      bg: '#F0F9FF'
    },
    { 
      id: 'map', 
      title: 'Live Tracking', 
      sub: 'Real-time device location', 
      icon: '🗺️', 
      screen: 'MapTracking',
      color: ['#10B981', '#059669'],
      bg: '#ECFDF5'
    },
    { 
      id: 'timeline', 
      title: 'Security Timeline', 
      sub: 'Recent activity log', 
      icon: '📜', 
      screen: 'SecurityTimeline',
      color: ['#A855F7', '#9333EA'],
      bg: '#FAF5FF'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1E1B4B', '#0F172A']} style={styles.header}>
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.headerTop}>
          <Text style={styles.greeting}>Tracker Shield</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: isSecure ? COLORS.success : COLORS.danger }]} />
            <Text style={styles.statusText}>{isSecure ? 'SECURE' : 'ALERT'}</Text>
          </View>
        </Animated.View>

        <View style={styles.shieldContainer}>
          <Animated.View style={[styles.pulseCircle, animatedShieldStyle]} />
          <View style={styles.mainShield}>
            <Text style={{ fontSize: 40 }}>{isSecure ? '🛡️' : '🚨'}</Text>
          </View>
        </View>

        <Animated.Text entering={FadeInDown.delay(400)} style={styles.mainStatus}>
          {isSecure ? 'System Fully Protected' : 'Security Breach Detected!'}
        </Animated.Text>
        
        <SecuritySlider onVerify={handleSOS} title="SLIDE TO TRIGGER SOS" />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.Text entering={FadeInUp.delay(500)} style={styles.sectionTitle}>
          Security Services
        </Animated.Text>

        <View style={styles.grid}>
          {widgets.map((w, i) => (
            <Animated.View 
              key={w.id} 
              entering={FadeInDown.delay(600 + i * 100).springify()}
              style={styles.gridItem}
            >
              <TouchableOpacity onPress={() => onNavigate(w.screen)} activeOpacity={0.8}>
                <View style={[styles.widgetCard, { backgroundColor: w.bg }]}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFF' }]}>
                    <Text style={{ fontSize: 24 }}>{w.icon}</Text>
                  </View>
                  <Text style={[styles.widgetTitle, { color: w.color[1] }]}>{w.title}</Text>
                  <Text style={styles.widgetSub}>{w.sub}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(1000)} style={styles.infoCard}>
           <Text style={styles.infoTitle}>Quick Security Tip</Text>
           <Text style={styles.infoText}>Always keep your protection bypass PIN secret. Enable "Intruder Capture" for maximum safety.</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: '#FFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  mainShield: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mainStatus: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.light.text,
    marginBottom: 20,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  widgetCard: {
    padding: 16,
    borderRadius: 24,
    height: 180,
    ...SHADOWS.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  widgetSub: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
    lineHeight: 18,
  }
});

export default Dashboard;
