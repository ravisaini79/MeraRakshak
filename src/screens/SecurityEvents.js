import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AuthService from '../services/AuthService';

const SecurityEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await AuthService.getSecurityEvents();
      setEvents(data);
    } catch (err) {
      console.log('Fetch events error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Security Events" showNotification />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Fetching security logs...</Text>
          </View>
        ) : events.length > 0 ? (
          events.map((event, idx) => (
            <EventItem 
              key={idx}
              type={event.type}
              message={event.message}
              time={new Date(event.timestamp).toLocaleTimeString()}
              severity={event.severity}
              photo={event.photo}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No security events recorded yet.</Text>
            <Text style={styles.emptySubtext}>Your device security is currently under monitoring.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav activeTab="Security" />
    </View>
  );
};

const EventItem = ({ type, message, time, severity, photo }) => (
  <Card style={styles.card}>
    <View style={styles.eventHeader}>
      <View style={[styles.indicator, { backgroundColor: severity === 'CRITICAL' ? COLORS.danger : COLORS.warning }]} />
      <Text style={styles.eventTime}>{time}</Text>
    </View>
    <Text style={styles.eventTitle}>{type.replace(/_/g, ' ')}</Text>
    <Text style={styles.eventDesc}>{message}</Text>
    {photo && (
      <View style={styles.photoContainer}>
        <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        <View style={styles.photoLabel}>
          <Text style={styles.photoLabelText}>Intruder Snapshot</Text>
        </View>
      </View>
    )}
  </Card>
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
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
    marginBottom: 20,
    fontWeight: '800',
  },
  card: {
    padding: SPACING.lg,
    marginBottom: 16,
    borderRadius: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 40,
    height: 6,
    borderRadius: 3,
  },
  eventTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    fontWeight: '700',
  },
  eventTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '900',
    color: COLORS.light.text,
    textTransform: 'capitalize',
  },
  eventDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  photoContainer: {
    marginTop: 15,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  photo: {
    width: '100%',
    height: 200,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: 8,
  },
  photoLabelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  loaderText: {
    ...TYPOGRAPHY.body,
    marginTop: 16,
    color: COLORS.light.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SecurityEvents;
