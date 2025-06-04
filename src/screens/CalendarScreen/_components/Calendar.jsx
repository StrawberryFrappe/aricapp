import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const getCalendarDays = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPreviousMonth = new Date(year, month, 0);

        const days = [];
        let week = [];

        // Adjust to start the week on Monday
        const startDay = (firstDayOfMonth.getDay() + 6) % 7;

        // Fill in days from the previous month
        for (let i = startDay; i > 0; i--) {
            week.push(lastDayOfPreviousMonth.getDate() - i + 1);
        }

        // Fill in days of the current month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            if (week.length === 7) {
                days.push(week);
                week = [];
            }
            week.push(day);
        }

        // Fill in days from the next month
        for (let i = 1; week.length < 7; i++) {
            week.push(i);
        }
        days.push(week);

        return days;
    };

    const calendarDays = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

    const isPreviousMonth = (day, weekIndex) => {
        return weekIndex === 0 && day > 7;
    };

    const isNextMonth = (day, weekIndex) => {
        return weekIndex === calendarDays.length - 1 && day <= 7;
    };

    const isToday = (day, weekIndex) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            !isPreviousMonth(day, weekIndex) &&
            !isNextMonth(day, weekIndex) &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const handleDaySelection = (day, weekIndex) => {
        if (!isPreviousMonth(day, weekIndex) && !isNextMonth(day, weekIndex)) {
            setSelectedDay(day);
        }
    };

    const getDayContainerStyles = (day, weekIndex) => {
        const baseStyles = [styles.dayContainer];

        if (isToday(day, weekIndex)) {
            baseStyles.push(styles.todayOutline);
        }

        if (selectedDay === day && !isPreviousMonth(day, weekIndex) && !isNextMonth(day, weekIndex)) {
            baseStyles.push(styles.selectedDayContainer);
        }

        return baseStyles;
    };

    const renderDay = (day, weekIndex, dayIndex) => {
        const isOtherMonth = isPreviousMonth(day, weekIndex) || isNextMonth(day, weekIndex);

        return (
            <TouchableOpacity
                key={`${weekIndex}-${dayIndex}`}
                style={getDayContainerStyles(day, weekIndex)}
                onPress={() => handleDaySelection(day, weekIndex)}
            >
                <Text style={[
                    styles.dayText,
                    isOtherMonth && styles.otherMonthText
                ]}>
                    {day}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with navigation arrows */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                >
                    <Text style={styles.navText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{
                    currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                }</Text>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                >
                    <Text style={styles.navText}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Days of week header */}
            <View style={styles.daysOfWeekContainer}>
                {daysOfWeek.map((day, index) => (
                    <View key={index} style={styles.dayOfWeekContainer}>
                        <Text style={styles.dayOfWeekText}>{day}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
                {calendarDays.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekRow}>
                        {week.map((day, dayIndex) => renderDay(day, weekIndex, dayIndex))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg, // Keep horizontal padding for stable width
        alignSelf: 'stretch',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md, // Reduce margin to minimize height
        paddingVertical: spacing.xs, // Reduce padding to minimize height
    },
    navButton: {
        padding: spacing.md,
        minWidth: 44,
        alignItems: 'center',
    },
    navText: {
        fontSize: 28,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
    },
    dayOfWeekContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    dayOfWeekText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },    
    calendarGrid: {
        flexDirection: 'column',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
        gap: spacing.xs,
        paddingTop: spacing.sm,
        alignSelf: 'stretch', // Ensures the grid stretches horizontally while hugging content vertically
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    dayContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
    },
    dayText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    otherMonthText: {
        color: colors.textSecondary,
        opacity: 0.5,
    },
    todayContainer: {
        backgroundColor: colors.highlight,
        borderRadius: 50,
    },    todayOutline: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 20, // Ensures the outline is round
    },
    selectedDayContainer: {
        backgroundColor: colors.primary,
        borderRadius: 20,
    },
});

export default Calendar;