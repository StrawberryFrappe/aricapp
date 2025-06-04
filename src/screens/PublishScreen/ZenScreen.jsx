import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { initializeShizuku, forceStopApp } from '../../ShizukuBridge';
import { commonStyles, colors } from '../../styles/commonStyles';
import TimePicker from '../../components/TimePicker';

/**
 * PublishScreen Component
 * This component allows users to create and publish new posts
 *
 * @function PublishScreen
 * @returns {JSX.Element}
 */

const ZenScreen = ({ navigation }) => {
  // Zen Mode timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const getDuration = () => hours * 3600 + minutes * 60 + seconds;
  const [timeLeft, setTimeLeft] = useState(getDuration());
  const [isRunning, setIsRunning] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);
  // Trigger Shizuku force-stop when timer finishes
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      forceStopApp('com.strawberryfrappe.aricapp')
        .then(() => {
          console.log('App force-stopped successfully');
        })
        .catch(err => {
          console.error('forceStopApp error', err);
          // Timer still completes even if force stop fails
        });
    }
  }, [timeLeft]);
  // Start handler: init Shizuku then begin countdown
  const handleStart = () => {
    initializeShizuku()
      .then(() => {
        // reset timer to selected duration
        setTimeLeft(getDuration());
        setIsRunning(true);
      })
      .catch(err => {
        console.warn('initializeShizuku error', err);
        // Still allow the timer to run even if Shizuku fails
        setTimeLeft(getDuration());
        setIsRunning(true);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        
        {/* Zen Mode Timer */}
        <View style={styles.timerContainer}>
          <TouchableOpacity
            style={[styles.circle, isRunning && styles.circleDisabled]}
            onPress={handleStart}
            disabled={isRunning}
          >
            <Text style={styles.timerText}>
              {isRunning ? timeLeft : 'START'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time picker for duration */}
        {!isRunning && (
          <TimePicker
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onChange={({ hours: h, minutes: m, seconds: s }) => {
              setHours(h);
              setMinutes(m);
              setSeconds(s);
              setTimeLeft(h * 3600 + m * 60 + s);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDisabled: {
    opacity: 0.6,
  },
  timerText: {
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default ZenScreen;
