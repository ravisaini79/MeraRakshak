import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../theme/Theme';

const Card = ({ children, style, glass = false }) => {
  return (
    <View style={[
      styles.card,
      glass ? styles.glass : styles.solid,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    ...SHADOWS.md,
  },
  solid: {
    backgroundColor: COLORS.light.card,
  },
  glass: {
    backgroundColor: COLORS.light.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default Card;
