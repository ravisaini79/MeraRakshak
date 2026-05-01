import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AuthService from '../services/AuthService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await AuthService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log('Fetch notifications error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Notifications" showNotification={false} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={() => setNotifications([])}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : notifications.length > 0 ? (
          notifications.map((item, idx) => (
            <NotificationItem 
              key={idx}
              title={item.title}
              body={item.body}
              time={new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              type={item.type}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notification yet</Text>
            <Text style={styles.emptySubtext}>We'll notify you when something important happens.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav activeTab="Alerts" />
    </View>
  );
};

const NotificationItem = ({ title, body, time, type }) => {
  const isAlert = type === 'THEFT' || type === 'SOS';
  
  return (
    <Card style={[styles.card, isAlert && styles.alertCard]}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: isAlert ? COLORS.danger : COLORS.primary }]}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <Text style={[styles.title, isAlert && { color: COLORS.danger }]}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
};

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
    fontWeight: '800',
  },
  clearAll: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  alertCard: {
    borderLeftColor: COLORS.danger,
    backgroundColor: '#FFF1F2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.light.text,
  },
  body: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.2,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.light.textSecondary,
    fontWeight: '700',
  },
  emptySubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});

export default NotificationsScreen;
