import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../styles/commonStyles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import CalendarHeader from './CalendarHeader';
import MonthGrid from './MonthGrid';

/**
 * Calendar Component
 * 
 * Main calendar component that orchestrates the header and month grid.
 * Refactored to use modular components for better maintainability.
 * 
 * @component Calendar
 * @param {Function} onDateSelect - Callback when a date is selected
 */
const Calendar = ({ onDateSelect }) => {
    const { colors } = useThemedStyles();
    
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Calendar Header with navigation */}
            <CalendarHeader />
            
            {/* Month Grid with days */}
            <MonthGrid onDateSelect={onDateSelect} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Use all available space
        paddingHorizontal: spacing.lg,
        padding: spacing.md,
    },
});

export default Calendar;