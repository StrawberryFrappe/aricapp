import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, Modal } from 'react-native';
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
      setIsRunning(false);
    }
  }, [timeLeft]);
  const handleStart = () => {
    setTimeLeft(getDuration());
    tapTimestampsRef.current = [];
    setIsRunning(true);
  };
  
  // If tapped 11 times within 10 seconds, stop the timer
  const handleCirclePress = () => {
    const now = Date.now();
    const recent = tapTimestampsRef.current.filter(t => now - t <= 10000);
    recent.push(now);
    tapTimestampsRef.current = recent;
    if (recent.length >= 11) {
      setIsRunning(false);
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
});

export default ZenScreen;
