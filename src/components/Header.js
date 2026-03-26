import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';

const Header = ({ title, subtitle, leftIcon, onLeftPress, rightIcon, onRightPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {leftIcon ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconBtn}>
            {leftIcon}
          </TouchableOpacity>
        ) : <View style={styles.spacer} />}
      </View>
      
      <View style={styles.centerCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.rightCol}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
            {rightIcon}
          </TouchableOpacity>
        ) : <View style={styles.spacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: COLORS.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 40, // Status bar area
  },
  leftCol: { flex: 1, alignItems: 'flex-start' },
  centerCol: { flex: 4, alignItems: 'center' },
  rightCol: { flex: 1, alignItems: 'flex-end' },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.light.text,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginTop: 2,
  },
  iconBtn: {
    padding: SPACING.sm,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  spacer: { width: 40 },
});

export default Header;
