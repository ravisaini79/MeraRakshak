import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import AuthService from '../services/AuthService';
import axios from 'axios';

const CapturedImages = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = await AuthService.getToken();
      const response = await axios.get(`${AuthService.getBaseUrl()}/api/security/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only events with photos
      const photoEvents = response.data.filter(event => event.photoUrl);
      setEvents(photoEvents);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.timestamp).toLocaleString();
    const appName = item.message.split(': ')[1] || 'Unknown';
    
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.photoUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.timestamp}>{date}</Text>
          {item.location && (
            <Text style={styles.location}>
              📍 {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Captured Images" 
        leftIcon={<Text style={{ fontSize: 20 }}>←</Text>} 
        onLeftPress={onBack} 
      />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No captured images found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  list: {
    padding: SPACING.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 250,
  },
  cardContent: {
    padding: SPACING.md,
  },
  appName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 4,
  },
  location: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    marginTop: 4,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
  }
});

export default CapturedImages;
