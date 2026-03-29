import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';
import Card from '../components/Card';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import AuthService from '../services/AuthService';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteIdentifier, setInviteIdentifier] = useState('');

  const fetchMembers = async () => {
    try {
      const data = await AuthService.getFamilyMembers();
      setMembers(data);
    } catch (err) {
      console.log('Failed to fetch members', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInvite = async () => {
    if (!inviteIdentifier) return;
    try {
      // First, check if user has a family. If not, create one.
      let currentMembers = await AuthService.getFamilyMembers();
      let groupId = "group-default"; // Mock fallback
      
      // In a real scenario, the backend handles finding/creating the user's group
      await AuthService.inviteMember(groupId, inviteIdentifier);
      Alert.alert('Success', 'Invitation sent to ' + inviteIdentifier);
      setInviteIdentifier('');
      setShowInviteModal(false);
      fetchMembers();
    } catch (err) {
      Alert.alert('Error', err);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Family Members" showNotification />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Circle</Text>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => setShowInviteModal(true)}
          >
            <Text style={styles.addBtnText}>+ Invite</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Syncing circle...</Text>
          </View>
        ) : members.length > 0 ? (
          members.map((member, idx) => (
            <MemberCard 
              key={member.userId || idx} 
              name={member.name} 
              role={member.role} 
              status={member.location ? "Live" : "Offline"}
              lastSeen={member.lastSeen}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No members in your circle yet.</Text>
            <TouchableOpacity 
              style={styles.createBtn}
              onPress={() => setShowInviteModal(true)}
            >
              <Text style={styles.createBtnText}>Start a Family Group</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Family Member</Text>
            <Text style={styles.modalSubtitle}>Enter their email or phone number to add them to your private family circle.</Text>
            
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="email@example.com" 
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={inviteIdentifier}
                onChangeText={setInviteIdentifier}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleInvite}
              >
                <Text style={styles.confirmText}>Send Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav activeTab="Family" />
    </View>
  );
};

const MemberCard = ({ name, role, status, lastSeen }) => (
  <Card style={styles.card}>
    <View style={styles.memberInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        {status === "Live" && <View style={styles.onlineBadge} />}
      </View>
      <View style={styles.details}>
        <Text style={styles.memberName}>{name}</Text>
        <Text style={styles.memberRole}>{role}</Text>
      </View>
    </View>
    <View style={styles.statusInfo}>
      <Text style={[styles.statusText, status === "Live" && { color: COLORS.success }]}>
        {status}
      </Text>
      <Text style={styles.lastSeen}>{lastSeen === 'Never' ? 'Not seen' : `Seen ${lastSeen}`}</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
    fontWeight: '800',
  },
  addBtn: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: 16,
    borderRadius: 20,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...SHADOWS.sm,
  },
  avatarText: {
    color: '#FFF',
    ...TYPOGRAPHY.h3,
    fontWeight: '800',
  },
  onlineBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2.5,
    borderColor: '#FFF',
  },
  memberName: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.light.text,
  },
  memberRole: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statusInfo: {
    alignItems: 'flex-end',
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lastSeen: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.light.textSecondary,
    marginTop: 4,
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
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
    ...SHADOWS.md,
  },
  createBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 28,
    ...SHADOWS.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.light.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    color: COLORS.light.text,
    ...TYPOGRAPHY.body,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  cancelText: {
    color: COLORS.light.textSecondary,
    fontWeight: '700',
    fontSize: 16,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default FamilyMembers;
