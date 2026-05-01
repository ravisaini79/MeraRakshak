import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const ProfileSettings = () => {
  return (
    <View style={styles.container}>
      <Header title="Profile" rightIcon={<Text>✏️</Text>} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={{ fontSize: 40 }}>👤</Text>
            <TouchableOpacity style={styles.editBadge}><Text style={{ fontSize: 12 }}>📷</Text></TouchableOpacity>
          </View>
          <Text style={styles.userName}>Ravi Kumar Saini</Text>
          <Text style={styles.userEmail}>ravi@example.com</Text>
          
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PREMIUM PLAN</Text>
          </View>
        </View>

        <SettingsGroup title="General">
          <SettingsItem label="Personal Information" icon="👤" />
          <SettingsItem label="Family Settings" icon="👥" />
          <SettingsItem label="Manage Devices" icon="📱" />
        </SettingsGroup>

        <SettingsGroup title="Security">
          <SettingsItem label="Two-Factor Auth" icon="🔐" showSwitch />
          <SettingsItem label="App Lock" icon="🛡️" showSwitch value={true} />
          <SettingsItem label="Change Password" icon="🔑" />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsItem label="Push Notifications" icon="🔔" showSwitch value={true} />
          <SettingsItem label="Email Alerts" icon="📧" showSwitch />
        </SettingsGroup>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav activeTab="Profile" />
    </View>
  );
};

const SettingsGroup = ({ title, children }) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <Card style={styles.groupCard}>{children}</Card>
  </View>
);

const SettingsItem = ({ label, icon, showSwitch, value }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={styles.itemIcon}><Text>{icon}</Text></View>
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    {showSwitch ? (
      <Switch value={value} trackColor={{ true: COLORS.primary }} />
    ) : (
      <Text style={{ color: '#E2E8F0' }}>➡️</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    ...SHADOWS.md,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    marginTop: 2,
  },
  proBadge: {
    marginTop: 15,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  proText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 10,
  },
  group: {
    marginBottom: SPACING.xl,
  },
  groupTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.light.textSecondary,
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  groupCard: {
    paddingVertical: 0,
    paddingHorizontal: SPACING.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  logoutBtn: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    marginTop: 10,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
    ...TYPOGRAPHY.body,
  },
});

export default ProfileSettings;
