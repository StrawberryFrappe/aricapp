import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import CalendarHeader from './CalendarHeader';
import MonthGrid from './MonthGrid';

/**
 * Calendar Component
 * 
 * Main calendar component that orchestrates the header and month grid.
 * Refactored to use modular components for better maintainability.
 * 
 * @component Calendar
 */
const Calendar = () => {
    return (
        <View style={styles.container}>
            {/* Calendar Header with navigation */}
            <CalendarHeader />
            
            {/* Month Grid with days */}
            <MonthGrid />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        alignSelf: 'stretch',
    },
});

export default Calendar;