/**
 * Calendar Header Component
 * 
 * Displays month/year title with navigation controls for previous/next month.
 * Includes today button and date picker for quick navigation to specific dates.
 * 
 * @component CalendarHeader
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import DatePicker from './DatePicker';

const CalendarHeader = () => {
  const { styles, colors } = useThemedStyles();
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
    <View style={[styles.row, styles.headerContainer]}>
      {/* Navigation Controls */}
      <TouchableOpacity
        style={[styles.button, styles.navButton]}
        onPress={navigateToPreviousMonth}
        accessibilityLabel="Previous month"
        accessibilityRole="button"
      >
        <Text style={[styles.text, styles.navText]}>‹</Text>
      </TouchableOpacity>

      {/* Month/Year Title */}
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleDatePickerOpen} style={styles.titleButton}>
          <Text style={[styles.text, styles.titleText]}>
            {currentViewData?.title || 'Calendar'}
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.row, styles.actionButtons]}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary + '20' }]}
            onPress={navigateToToday}
            accessibilityLabel="Go to today"
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.borderDefault + '30' }]}
            onPress={handleDatePickerOpen}
            accessibilityLabel="Open date picker"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.navButton]}
        onPress={navigateToNextMonth}
        accessibilityLabel="Next month"
        accessibilityRole="button"
      >
        <Text style={[styles.text, styles.navText]}>›</Text>
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

export default CalendarHeader;
