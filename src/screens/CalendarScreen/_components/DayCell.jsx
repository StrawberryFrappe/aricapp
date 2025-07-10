/**
 * Day Cell Component
 * 
 * Individual day rendering with event indicators, selection states, and accessibility.
 * Handles different states: current month, other month, today, selected, with events.
 * 
 * @component DayCell
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';

const DayCell = ({ 
  dayObj, 
  isSelected, 
  hasEvents, 
  onPress,
  weekIndex,
  dayIndex 
}) => {
  const getDayContainerStyles = () => {
    const baseStyles = [styles.dayContainer];

    if (dayObj.isToday) {
      baseStyles.push(styles.todayOutline);
    }

    if (isSelected) {
      baseStyles.push(styles.selectedDayContainer);
    }

    if (!dayObj.isCurrentMonth) {
      baseStyles.push(styles.otherMonthContainer);
    }

    return baseStyles;
  };

  const getDayTextStyles = () => {
    const baseStyles = [styles.dayText];

    if (!dayObj.isCurrentMonth) {
      baseStyles.push(styles.otherMonthText);
    }

    if (isSelected) {
      baseStyles.push(styles.selectedDayText);
    }

    if (dayObj.isToday && !isSelected) {
      baseStyles.push(styles.todayText);
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      key={`${weekIndex}-${dayIndex}`}
      style={getDayContainerStyles()}
      onPress={() => onPress(dayObj)}
      accessibilityLabel={`${dayObj.day} ${dayObj.isCurrentMonth ? '' : 'next month'}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={getDayTextStyles()}>
        {dayObj.day}
      </Text>
      
      {/* Event indicators */}
      {hasEvents && (
        <View style={styles.eventIndicatorContainer}>
          <View style={styles.eventIndicator} />
        </View>
      )}
      
      {/* Multiple events indicator */}
      {hasEvents && Array.isArray(hasEvents) && hasEvents.length > 1 && (
        <View style={styles.multipleEventsIndicator}>
          <Text style={styles.eventCount}>
            {hasEvents.length > 9 ? '9+' : hasEvents.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
    margin: 1,
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  otherMonthContainer: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: colors.textSecondary,
  },
  todayOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  todayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedDayContainer: {
    backgroundColor: colors.primary,
  },
  selectedDayText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  eventIndicatorContainer: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.semanticBlue,
  },
  multipleEventsIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.semanticRed,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    fontSize: 10,
    color: colors.background,
    fontWeight: 'bold',
  },
});

export default DayCell;
