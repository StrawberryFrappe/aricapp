import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, Modal, Switch, Alert } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import TimePicker from '../../components/TimePicker';
import AppBlocking, { DEFAULT_BLOCKED_APPS } from '../../services/AppBlocking';

/**
 * ZenScreen Component
 * This component provides a focus/meditation interface for productivity enhancement.
 *
 * @function ZenScreen
 * @returns {JSX.Element}
 */

const ZenScreen = ({ navigation }) => {
  const scale = 1.33;
  // Zen Mode timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  // preset durations in seconds: 15, 30, 45 minutes
  const [presets, setPresets] = useState([15 * 60, 30 * 60, 45 * 60]);
  // state for editing a preset
  const [editingPreset, setEditingPreset] = useState(null);
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);
  const [editSeconds, setEditSeconds] = useState(0);
  const getDuration = () => hours * 3600 + minutes * 60 + seconds;
  const [timeLeft, setTimeLeft] = useState(getDuration());
  const [isRunning, setIsRunning] = useState(false);
  // Track tap timestamps to detect emergency stop
  const tapTimestampsRef = useRef([]);

  // App blocking state
  const [appBlockingEnabled, setAppBlockingEnabled] = useState(false);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);
  const [blockingActive, setBlockingActive] = useState(false);

  // Check accessibility status on mount
  useEffect(() => {
    checkAccessibilityStatus();
    checkBlockingStatus();
  }, []);

  // Check accessibility service status
  const checkAccessibilityStatus = async () => {
    try {
      const enabled = await AppBlocking.isAccessibilityEnabled();
      setIsAccessibilityEnabled(enabled);
    } catch (error) {
      console.warn('Failed to check accessibility status:', error);
    }
  };

  // Check if blocking is currently active
  const checkBlockingStatus = async () => {
    try {
      const active = await AppBlocking.getBlockingStatus();
      setBlockingActive(active);
    } catch (error) {
      console.warn('Failed to check blocking status:', error);
    }
  };

  // Handle app blocking toggle
  const handleAppBlockingToggle = async (enabled) => {
    if (enabled && !isAccessibilityEnabled) {
      Alert.alert(
        'Enable Accessibility Service',
        'To use app blocking, you need to enable the accessibility service. This allows the app to detect when blocked apps are opened and automatically close them.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: async () => {
              try {
                await AppBlocking.openAccessibilitySettings();
                // Check again after user returns (they might have enabled it)
                setTimeout(checkAccessibilityStatus, 1000);
              } catch (error) {
                Alert.alert('Error', 'Failed to open accessibility settings');
              }
            }
          }
        ]
      );
      return;
    }
    setAppBlockingEnabled(enabled);
  };

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerEnd();
    }
  }, [timeLeft]);

  const handleStart = async () => {
    setTimeLeft(getDuration());
    tapTimestampsRef.current = [];
    setIsRunning(true);

    // Start app blocking if enabled
    if (appBlockingEnabled && isAccessibilityEnabled) {
      try {
        const durationMinutes = Math.ceil(getDuration() / 60); // Convert to minutes, round up
        await AppBlocking.startBlocking(durationMinutes, DEFAULT_BLOCKED_APPS);
        setBlockingActive(true);
      } catch (error) {
        console.warn('Failed to start app blocking:', error);
        Alert.alert('App Blocking Error', 'Failed to start app blocking. Timer will continue without blocking.');
      }
    }
  };

  const handleTimerEnd = async () => {
    setIsRunning(false);
    
    // Stop app blocking
    if (blockingActive) {
      try {
        AppBlocking.stopBlocking();
        setBlockingActive(false);
      } catch (error) {
        console.warn('Failed to stop app blocking:', error);
      }
    }
  };

  const handleEmergencyStop = async () => {
    setIsRunning(false);
    
    // Stop app blocking on emergency stop too
    if (blockingActive) {
      try {
        AppBlocking.stopBlocking();
        setBlockingActive(false);
      } catch (error) {
        console.warn('Failed to stop app blocking:', error);
      }
    }
  };
  
  // If tapped 11 times within 10 seconds, stop the timer
  const handleCirclePress = () => {
    const now = Date.now();
    const recent = tapTimestampsRef.current.filter(t => now - t <= 10000);
    recent.push(now);
    tapTimestampsRef.current = recent;
    if (recent.length >= 11) {
      handleEmergencyStop();
      tapTimestampsRef.current = [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {!isRunning ? (
          <View style={[styles.centerContainer, { transform: [{ scale }] }] }>
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
            
            {/* App Blocking Toggle */}
            <View style={styles.appBlockingContainer}>
              <View style={styles.blockingToggleRow}>
                <View style={styles.blockingInfo}>
                  <Text style={styles.blockingTitle}>Enable App Blocking</Text>
                  <Text style={styles.blockingSubtitle}>
                    {isAccessibilityEnabled 
                      ? (blockingActive ? 'Active - Apps will be blocked' : 'Ready - Apps blocked during timer')
                      : 'Requires accessibility permission'
                    }
                  </Text>
                </View>
                <Switch
                  value={appBlockingEnabled}
                  onValueChange={handleAppBlockingToggle}
                  trackColor={{ true: colors.primaryLight, false: colors.borderLight }}
                  thumbColor={appBlockingEnabled ? colors.primary : colors.textSecondary}
                  disabled={!isAccessibilityEnabled}
                />
              </View>
              {!isAccessibilityEnabled && (
                <TouchableOpacity 
                  style={styles.permissionButton}
                  onPress={() => handleAppBlockingToggle(true)}
                >
                  <Text style={styles.permissionButtonText}>Grant Accessibility Permission</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* preset circles */}
            <View style={styles.presetsContainer}>
              {presets.map((dur, idx) => {
                const h = Math.floor(dur / 3600);
                const m = Math.floor((dur % 3600) / 60);
                const s = (h % 3600) % 60;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetCircle}
                    onPress={() => {
                      setHours(h);
                      setMinutes(m);
                      setSeconds(s);
                      setTimeLeft(dur);
                    }}
                    onLongPress={() => {
                      setEditingPreset(idx);
                      setEditHours(h);
                      setEditMinutes(m);
                      setEditSeconds(dur % 60);
                    }}
                    delayLongPress={1500}
                  >
                    <Text style={styles.presetText}>{`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.timerContainer, { transform: [{ scale }] }] }>
            <TouchableOpacity style={styles.circle} onPress={handleCirclePress}>
              <Text style={styles.timerText}>{
                String(Math.floor(timeLeft/3600)).padStart(2,'0') + ':' +
                String(Math.floor((timeLeft%3600)/60)).padStart(2,'0') + ':' +
                String(timeLeft%60).padStart(2,'0')
              }</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
      {/* edit preset modal */}
      {editingPreset !== null && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.editForm}>
              <Text style={styles.modalText}>Edit preset #{editingPreset + 1}</Text>
              <View style={styles.editInputsContainer}>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  keyboardType="numeric"
                  value={String(editHours)}
                  onChangeText={t => setEditHours(Number(t) || 0)}
                  placeholder="HH"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
                <Text style={styles.modalText}>:</Text>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  keyboardType="numeric"
                  value={String(editMinutes)}
                  onChangeText={t => setEditMinutes(Number(t) || 0)}
                  placeholder="MM"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
                <Text style={styles.modalText}>:</Text>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  keyboardType="numeric"
                  value={String(editSeconds)}
                  onChangeText={t => setEditSeconds(Number(t) || 0)}
                  placeholder="SS"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>
              <TouchableOpacity
                style={styles.formButton}
                onPress={() => {
                  const newDur = editHours * 3600 + editMinutes * 60 + editSeconds;
                  setPresets(ps => ps.map((d,i) => (i === editingPreset ? newDur : d)));
                  setEditingPreset(null);
                }}
              >
                <Text style={styles.modalText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    width: '80%',
  },
  presetCircle: {
    width: 69,
    height: 69,
    borderRadius: 69,
    borderWidth: 2,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  modalOverlay: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
  },
  editForm: {
    backgroundColor: colors.background,
    padding:20,
    borderRadius:8,
    alignItems:'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  editInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeInput: {
    width: 50,
    color: '#fff',
    borderColor: colors.textSecondary,
    marginHorizontal: 5,
  },
  input: {
    borderWidth:1,
    borderColor:colors.textSecondary,
    width:80,
    marginVertical:10,
    textAlign:'center',
    color:'#fff',
  },
  formButton: {
    backgroundColor: colors.primary,
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:5,
  },
  startButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 15,
  },
  startButtonText: {
    color: colors.textOnPrimary || '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBlockingContainer: {
    width: '90%',
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  blockingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockingInfo: {
    flex: 1,
    marginRight: 16,
  },
  blockingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  blockingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  permissionButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: colors.textOnPrimary || '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ZenScreen;
