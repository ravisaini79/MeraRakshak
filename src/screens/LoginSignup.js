import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/Theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const LoginSignup = () => {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (isSignup) {
      if (!name || !phone || !confirmPassword) {
        Alert.alert('Error', 'All fields are required for signup');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    try {
      let data;
      if (isSignup) {
        data = await AuthService.register({ name, email, phone, password });
      } else {
        data = await AuthService.login(email, password);
      }
      
      if (data && data.token) {
        login(data); // This handles token storage and navigation
      }
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Start protecting your family today' : 'Secure your family today'}
          </Text>
        </View>

        <Card style={styles.card}>
          {isSignup && (
            <Input 
              label="Full Name" 
              placeholder="John Doe" 
              value={name}
              onChangeText={setName}
            />
          )}

          <Input 
            label="Email Address" 
            placeholder="john@example.com" 
            keyboardType="email-address" 
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {isSignup && (
            <Input 
              label="Phone Number" 
              placeholder="+1 234 567 890" 
              keyboardType="phone-pad" 
              value={phone}
              onChangeText={setPhone}
            />
          )}

          <Input 
            label="Password" 
            placeholder="••••••••" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          {isSignup && (
            <Input 
              label="Confirm Password" 
              placeholder="••••••••" 
              secureTextEntry 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          )}

          <Button 
            title={isLoading ? <ActivityIndicator color="#FFF" /> : (isSignup ? "Sign Up" : "Sign In")} 
            onPress={handleAuth} 
            style={styles.btn} 
            disabled={isLoading}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.signUpText}>{isSignup ? "Sign In" : "Sign Up"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: 80,
  },
  header: {
    marginBottom: 40,
  },
  welcome: {
    ...TYPOGRAPHY.h1,
    color: COLORS.light.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: SPACING.xl,
  },
  btn: {
    marginTop: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  or: {
    marginHorizontal: 15,
    ...TYPOGRAPHY.caption,
    color: COLORS.light.textSecondary,
  },
  socialBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.text,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.light.textSecondary,
  },
  signUpText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default LoginSignup;
