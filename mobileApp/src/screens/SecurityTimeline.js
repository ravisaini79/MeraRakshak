import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import AppService from '../services/AppService';

const SecurityTimeline = ({ onBack }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimeline = async () => {
    try {
      const data = await AppService.getSecurityTimeline();
      setTimeline(data);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimeline();
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'APP_OPEN_ALERT': return '📱';
      case 'THEFT_REPORTED': return '🚨';
      case 'BOOT_COMPLETED': return '🔄';
      case 'LOCATION': return '📍';
      default: return '🛡️';
    }
  };

  const renderItem = ({ item, index }) => {
    const isLast = index === timeline.length - 1;
    const date = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

    return (
      <View style={styles.timelineItem}>
        <View style={styles.leftColumn}>
          <Text style={styles.timeText}>{date}</Text>
          <Text style={styles.dayText}>{day}</Text>
        </View>

        <View style={styles.centerColumn}>
          <View style={[styles.dot, { backgroundColor: item.photoUrl ? COLORS.error : COLORS.primary }]} />
          {!isLast && <View style={styles.line} />}
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventIcon}>{getEventIcon(item.type || item.timelineType)}</Text>
              <Text style={styles.eventTitle}>{item.type || 'Location'}</Text>
            </View>
            
            <Text style={styles.eventMessage}>{item.message}</Text>
            
            {item.photoUrl && (
              <Image source={{ uri: item.photoUrl }} style={styles.eventImage} />
            )}

            {(item.location || (item.lat && item.lng)) && (
              <Text style={styles.locationText}>
                📍 {item.location?.lat?.toFixed(4) || item.lat?.toFixed(4)}, {item.location?.lng?.toFixed(4) || item.lng?.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Security Timeline" 
        leftIcon={<Text style={{ fontSize: 20 }}>←</Text>} 
        onLeftPress={onBack} 
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={timeline}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No activity detected yet.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  list: {
    padding: SPACING.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 100,
  },
  leftColumn: {
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 4,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.light.text,
  },
  dayText: {
    fontSize: 10,
    color: COLORS.light.textSecondary,
  },
  centerColumn: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#D1D5DB',
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  eventTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.primary,
  },
  eventMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.text,
    marginBottom: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 10,
    color: COLORS.secondary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    color: COLORS.light.textSecondary,
    fontStyle: 'italic',
  }
});

export default SecurityTimeline;
