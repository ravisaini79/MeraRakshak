import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Real-time Tracking',
    description: 'Keep an eye on your loved ones and devices with pinpoint accuracy on the map.',
    image: '📍',
  },
  {
    id: '2',
    title: 'Instant SOS Alerts',
    description: 'One-tap emergency alerts sent to your family with your live location.',
    image: '🚨',
  },
  {
    id: '3',
    title: 'Anti-Theft Security',
    description: 'Remotely lock your device or wipe data if it gets stolen or lost.',
    image: '🛡️',
  },
];

const Onboarding = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.image}>{item.image}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>

        <Button 
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"} 
          onPress={() => {
            if (currentIndex === SLIDES.length - 1) {
              onComplete?.();
            } else {
              // Normally would scroll FlatList, but for UI mockup this is fine
              setCurrentIndex(prev => prev + 1);
            }
          }}
          style={styles.button}
        />
        
        <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  image: {
    fontSize: 100,
    marginBottom: 40,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    height: height * 0.25,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#CBD5E1',
  },
  button: {
    width: '100%',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 15,
  },
  skipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
  },
});

export default Onboarding;
