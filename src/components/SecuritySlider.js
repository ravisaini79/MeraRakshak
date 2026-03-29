import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 40;
const BUTTON_SIZE = 50;
const H_THRESHOLD = SLIDER_WIDTH - BUTTON_SIZE - 4;

const SecuritySlider = ({ onVerify, title = "SLIDE TO SECURE" }) => {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(0, Math.min(event.translationX, H_THRESHOLD));
    })
    .onEnd(() => {
      if (translateX.value > H_THRESHOLD * 0.8) {
        translateX.value = withSpring(H_THRESHOLD);
        runOnJS(onVerify)();
        // Reset after a delay
        setTimeout(() => {
          translateX.value = withSpring(0);
        }, 1500);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, H_THRESHOLD * 0.5], [1, 0]),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.track}
      >
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          {title}
        </Animated.Text>
        
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.button, animatedButtonStyle]}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.buttonGradient}
            >
              <Text style={styles.arrow}>❯</Text>
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: SLIDER_WIDTH,
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 20,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 25,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  arrow: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default SecuritySlider;
