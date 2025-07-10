/**
 * Month Grid Component
 * 
 * 6-week month grid display with proper week start handling.
 * Renders the calendar grid with days of week header and week rows.
 * 
 * @component MonthGrid
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import DayCell from './DayCell';

const MonthGrid = () => {
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
  };

  const getEventsForDay = (date) => {
    const events = getEventsByDate ? getEventsByDate(date) : [];
    return events.length > 0 ? events : false;
  };

  const renderWeekRow = (week, weekIndex) => (
    <View key={weekIndex} style={styles.weekRow}>
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
    <View style={styles.container}>
      {/* Days of week header */}
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayOfWeekContainer}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
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
        <Text style={styles.gridInfoText}>
          {currentViewData?.grid?.length || 0} weeks displayed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignSelf: 'stretch',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30', // 30% opacity
  },
  dayOfWeekContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignSelf: 'stretch',
    backgroundColor: colors.background,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  gridInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    opacity: 0, // Hidden but available for screen readers
  },
  gridInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default MonthGrid;
