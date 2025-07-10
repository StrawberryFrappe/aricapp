/**
 * Month Grid Component
 * 
 * 6-week month grid display with proper week start handling.
 * Renders the calendar grid with days of week header and week rows.
 * 
 * @component MonthGrid
 * @param {Function} onDateSelect - Callback when a date is selected
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import DayCell from './DayCell';

const MonthGrid = ({ onDateSelect }) => {
  const { styles, colors } = useThemedStyles();
  const { 
    viewState, 
    currentViewData, 
    selectDate,
    hasEventsOnDate,
    getEventsByDate
  } = useCalendar();

  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  const handleDaySelection = (dayObj) => {
    selectDate(dayObj.date);
    
    // Call parent callback if provided
    if (onDateSelect) {
      onDateSelect(dayObj.date);
    }
  };

  const getEventsForDay = (date) => {
    const events = getEventsByDate ? getEventsByDate(date) : [];
    return events.length > 0 ? events : false;
  };

  const renderWeekRow = (week, weekIndex) => (
    <View key={weekIndex} style={[styles.row, styles.weekRow]}>
      {week.map((dayObj, dayIndex) => {
        const isSelected = viewState.selectedDate === dayObj.date;
        const dayEvents = getEventsForDay(dayObj.date);
        const hasEvents = hasEventsOnDate ? hasEventsOnDate(dayObj.date) : dayEvents;

        return (
          <DayCell
            key={`${weekIndex}-${dayIndex}`}
            dayObj={dayObj}
            isSelected={isSelected}
            hasEvents={hasEvents}
            onPress={handleDaySelection}
            weekIndex={weekIndex}
            dayIndex={dayIndex}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[
      styles.container, 
      localStyles.monthGridContainer,
      { backgroundColor: colors.background }
    ]}>
      {/* Days of week header */}
      <View style={[styles.row, styles.monthGridHeader]}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayOfWeekContainer}>
            <Text style={[styles.smallText, styles.dayOfWeekText]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid - 6 weeks */}
      <View style={styles.calendarGrid}>
        {currentViewData?.grid?.map((week, weekIndex) => 
          renderWeekRow(week, weekIndex)
        )}
      </View>

      {/* Grid status info for accessibility */}
      <View style={styles.gridInfo} accessible={false}>
        <Text style={[styles.smallText, { opacity: 0 }]}>
          {currentViewData?.grid?.length || 0} weeks displayed
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  monthGridContainer: {
    flex: 1,
    minHeight: 300, // Ensure minimum height for calendar grid
  },
});



export default MonthGrid;
