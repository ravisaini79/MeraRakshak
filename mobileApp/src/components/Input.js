import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.light.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    height: 56,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.text,
  },
});

export default Input;
