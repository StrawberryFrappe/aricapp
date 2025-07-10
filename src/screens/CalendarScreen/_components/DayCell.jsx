/**
 * Day Cell Component
 * 
 * Individual day rendering with event indicators, selection states, and accessibility.
 * Handles different states: current month, other month, today, selected, with events.
 * 
 * @component DayCell
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

const DayCell = ({ 
  dayObj, 
  isSelected, 
  hasEvents, 
  onPress,
  weekIndex,
  dayIndex 
}) => {
  const { styles, colors } = useThemedStyles();

  const getDayContainerStyles = () => {
    const baseStyles = [styles.dayContainer];

    if (dayObj.isToday) {
      baseStyles.push({ borderWidth: 2, borderColor: colors.primary, borderRadius: 8 });
    }

    if (isSelected) {
      baseStyles.push({ backgroundColor: colors.primary });
    }

    if (!dayObj.isCurrentMonth) {
      baseStyles.push({ opacity: 0.3 });
    }

    return baseStyles;
  };

  const getDayTextStyles = () => {
    const baseStyles = [styles.dayText];

    if (!dayObj.isCurrentMonth) {
      baseStyles.push({ color: colors.textSecondary });
    }

    if (isSelected) {
      baseStyles.push({ color: colors.background, fontWeight: 'bold' });
    }

    if (dayObj.isToday && !isSelected) {
      baseStyles.push({ color: colors.primary, fontWeight: 'bold' });
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
          <View style={[styles.eventIndicator, { backgroundColor: colors.semanticBlue }]} />
        </View>
      )}
      
      {/* Multiple events indicator */}
      {hasEvents && Array.isArray(hasEvents) && hasEvents.length > 1 && (
        <View style={[styles.multipleEventsIndicator, { backgroundColor: colors.error }]}>
          <Text style={[styles.eventCount, { color: colors.background }]}>
            {hasEvents.length > 9 ? '9+' : hasEvents.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};



export default DayCell;
