import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/Theme';

const Button = ({ title, onPress, type = 'primary', style, textStyle }) => {
  const isPrimary = type === 'primary';
  const isDanger = type === 'danger';
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.primary : isDanger ? styles.danger : styles.secondary,
        style
      ]}
    >
      <Text style={[
        styles.text,
        !isPrimary && !isDanger ? styles.secondaryText : styles.primaryText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  primaryText: {
    color: '#FFF',
  },
  secondaryText: {
    color: COLORS.primary,
  },
  text: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '700',
  },
});

export default Button;
