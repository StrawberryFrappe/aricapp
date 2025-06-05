import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

// Generate array of hours 0-23
const hours = Array.from({ length: 24 }, (_, i) => i);

const TodaySchedule = ({ onAdd = () => {} }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const hourHeight = 60; // height for each hour row in px

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const pos = now.getHours() * hourHeight + now.getMinutes() * (hourHeight / 60);
      setCurrentPosition(pos);
    };
    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'short' }).toUpperCase();
  const dayNumber = now.getDate();
  const dayName = now.toLocaleString('default', { weekday: 'long' });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.monthText}>{monthName}</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateBox}>
            <Text style={styles.dateNumber}>{dayNumber}</Text>
          </View>
          <Text style={styles.dayText}>{dayName}</Text>
        </View>
      </View>
      <View style={styles.timelineContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {hours.map(hour => (
            <View key={hour} style={[styles.hourRow, { height: hourHeight }]}>  
              <Text style={styles.hourLabel}>
                {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}
              </Text>
              <View style={styles.line} />
            </View>
          ))}
          <View style={[styles.currentLine, { top: currentPosition }]} />
        </ScrollView>
      </View>
      <View style={styles.bottomBar}>
        <TextInput
          style={styles.input}
          placeholder={`Add event on ${monthName} ${dayNumber}`}
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  monthText: {
    ...commonStyles.titleText,
    fontSize: 18,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dateNumber: {
    ...commonStyles.titleText,
  },
  dayText: {
    ...commonStyles.bodyText,
  },
  timelineContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingBottom: 100,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourLabel: {
    width: 50,
    ...commonStyles.smallText,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  currentLine: {
    position: 'absolute',
    left: 70,
    right: 0,
    height: 1,
    backgroundColor: colors.accent,
  },
  bottomBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default TodaySchedule;
