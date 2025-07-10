/**
 * Calendar Header Component
 * 
 * Displays month/year title with navigation controls for previous/next month.
 * Includes today button and date picker for quick navigation to specific dates.
 * 
 * @component CalendarHeader
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import DatePicker from './DatePicker';

const CalendarHeader = () => {
  const { 
    currentViewData, 
    navigateToPreviousMonth, 
    navigateToNextMonth,
    navigateToToday 
  } = useCalendar();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDatePickerOpen = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Navigation Controls */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={navigateToPreviousMonth}
        accessibilityLabel="Previous month"
        accessibilityRole="button"
      >
        <Text style={styles.navText}>‹</Text>
      </TouchableOpacity>

      {/* Month/Year Title */}
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleDatePickerOpen} style={styles.titleButton}>
          <Text style={styles.monthTitle}>
            {currentViewData?.title || 'Calendar'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.todayButton}
            onPress={navigateToToday}
            accessibilityLabel="Go to today"
            accessibilityRole="button"
          >
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={handleDatePickerOpen}
            accessibilityLabel="Open date picker"
            accessibilityRole="button"
          >
            <Text style={styles.pickerText}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.navButton}
        onPress={navigateToNextMonth}
        accessibilityLabel="Next month"
        accessibilityRole="button"
      >
        <Text style={styles.navText}>›</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DatePicker
        isVisible={showDatePicker}
        onClose={handleDatePickerClose}
        onDateSelect={(date) => {
          // Date picker handles navigation internally
          console.log('Selected date:', date);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    padding: spacing.md,
    minWidth: 44,
    alignItems: 'center',
    borderRadius: 8,
  },
  navText: {
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  todayButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
  },
  todayText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  pickerButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.border + '30',
    borderRadius: 12,
  },
  pickerText: {
    fontSize: 12,
  },
});

export default CalendarHeader;
