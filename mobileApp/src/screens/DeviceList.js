import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const DEVICES = [
  { id: '1', name: 'iPhone 15 Pro', type: 'Mobile', battery: '84%', lastSeen: 'Just now', icon: '📱' },
  { id: '2', name: 'John\'s Pixel 8', type: 'Mobile', battery: '42%', lastSeen: '2 mins ago', icon: '📱' },
  { id: '3', name: 'MacBook Pro 16', type: 'Laptop', battery: '95%', lastSeen: '10 mins ago', icon: '💻' },
  { id: '4', name: 'iPad Air', type: 'Tablet', battery: '20%', lastSeen: '1 hour ago', icon: '📠' },
];

const DeviceList = () => {
  const renderItem = ({ item }) => (
    <Card style={styles.deviceCard}>
      <View style={styles.leftInfo}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 24 }}>{item.icon}</Text>
        </View>
        <View>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceType}>{item.type} • {item.lastSeen}</Text>
        </View>
      </View>
      <View style={styles.rightInfo}>
        <Text style={[styles.battery, parseInt(item.battery) < 30 && { color: COLORS.danger }]}>
          {item.battery}
        </Text>
        <Text style={styles.batteryLabel}>Battery</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="My Devices" 
        rightIcon={<Text style={{ fontSize: 20 }}>➕</Text>} 
      />
      
      <FlatList
        data={DEVICES}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.headerInfo}>
            <Text style={styles.totalText}>4 Devices Tracked</Text>
            <TouchableOpacity><Text style={styles.filterText}>Filter</Text></TouchableOpacity>
          </View>
        )}
      />

      <BottomNav activeTab="Devices" />
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
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  totalText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
  },
  filterText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  deviceName: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.light.text,
    fontWeight: '700',
  },
  deviceType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 4,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  battery: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.success,
    fontWeight: '800',
  },
  batteryLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 2,
    color: COLORS.light.textSecondary,
    textTransform: 'uppercase',
  },
});

export default DeviceList;
