import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const ALERTS = [
  { id: '1', title: 'SOS Alert!', body: 'John Doe triggered an SOS alert from Lincoln High School.', time: '2 mins ago', type: 'critical' },
  { id: '2', title: 'Low Battery', body: 'Emily\'s iPhone battery is below 15%.', time: '1 hour ago', type: 'warning' },
  { id: '3', title: 'Geofence Entry', body: 'Jane Doe entered the "Office" zone.', time: '3 hours ago', type: 'info' },
  { id: '4', title: 'New Login', body: 'Your account was logged in from a new MacBook Pro.', time: '5 hours ago', type: 'warning' },
];

const Alerts = () => {
  const renderItem = ({ item }) => {
    const isCritical = item.type === 'critical';
    const isWarning = item.type === 'warning';
    
    return (
      <Card style={[styles.alertCard, isCritical && styles.criticalBorder]}>
        <View style={styles.alertHeader}>
          <View style={[styles.typeBadge, { backgroundColor: isCritical ? COLORS.danger : isWarning ? COLORS.accent : COLORS.primary }]}>
            <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertBody}>{item.body}</Text>
        
        {isCritical && (
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>View Location</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Alerts" 
        rightIcon={<Text>⚙️</Text>} 
      />
      
      <FlatList
        data={ALERTS}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyExtractor={item => item.id}
      />

      <BottomNav activeTab="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  list: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  alertCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  criticalBorder: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.danger,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
  },
  alertTitle: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  alertBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: 15,
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default Alerts;
