import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

/**
 * MyWeek Component
 * 
 * PURPOSE: Displays current week with selectable days
 * BEHAVIOR: 
 * - Shows current month and week dates
 * - Highlights today with blue outline
 * - Allows selection of any day (green fill)
 * - Navigates to calendar on "Ver Todo" tap
 */
const MyWeek = () => {
    // NAVIGATION SETUP
    const navigation = useNavigation();
    const navigateToCalendar = () => {
        navigation.navigate("CalendarScreen"); 
    };

    // DATE CALCULATIONS
    const currentDate = new Date();
    const todayNumber = currentDate.getDate();
    
    // USER INTERACTION STATE
    const [selectedDayNumber, setSelectedDayNumber] = useState(null);
    
    // MONTH NAMES IN SPANISH (index matches Date.getMonth())
    const SPANISH_MONTHS = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentMonthName = SPANISH_MONTHS[currentDate.getMonth()];
    
    // WEEK DAY ABBREVIATIONS IN SPANISH (Monday to Sunday)
    const WEEK_DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    
    // CALCULATE CURRENT WEEK DATES (Monday to Sunday)
    const calculateCurrentWeekDates = () => {
        const currentDayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, etc.
        
        // Calculate offset to get to Monday of current week
        const offsetToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
        
        const weekDates = [];
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dateInWeek = new Date(currentDate);
            dateInWeek.setDate(currentDate.getDate() + offsetToMonday + dayIndex);
            weekDates.push(dateInWeek.getDate());
        }
        return weekDates;
    };
    
    const currentWeekDates = calculateCurrentWeekDates();

    // EVENT HANDLERS
    const handleDaySelection = (dayNumber) => {
        setSelectedDayNumber(dayNumber);
    };

    // STYLE HELPERS
    const getDayContainerStyles = (dayNumber) => {
        const baseStyles = [styles.dayCircle];
        
        if (dayNumber === todayNumber) {
            baseStyles.push(styles.todayCircle);
        }
        
        if (dayNumber === selectedDayNumber) {
            baseStyles.push(styles.selectedDayCircle);
        }
        
        return baseStyles;
    };

    const getDayTextStyles = (dayNumber) => {
        const baseStyles = [styles.dayNumber];
        
        if (dayNumber === todayNumber) {
            baseStyles.push(styles.todayNumber);
        }
        
        if (dayNumber === selectedDayNumber) {
            baseStyles.push(styles.selectedDayNumber);
        }
        
        return baseStyles;
    };    // RENDER COMPONENT
    return (
        <View style={styles.weekCardContainer}>
            {/* HEADER SECTION */}            
            <View style={styles.headerSection}>
                <Text style={styles.weekTitle}>Mi Semana</Text>
                <TouchableOpacity 
                    onPress={navigateToCalendar}
                    accessibilityLabel="Ver calendario completo"
                    accessibilityRole="button"
                >
                    <Text style={styles.viewAllButton}>Ver Todo</Text>
                </TouchableOpacity>
            </View>

            {/* MONTH SECTION */}
            <View style={styles.monthSection}>
                <Text style={styles.monthName}>{currentMonthName}</Text>
            </View>

            {/* WEEK DAYS SECTION */}
            <View style={styles.weekDaysContainer}>
                {WEEK_DAY_LABELS.map((dayLabel, dayIndex) => {
                    const dayNumber = currentWeekDates[dayIndex];
                    const isToday = dayNumber === todayNumber;
                    const isSelected = dayNumber === selectedDayNumber;
                    
                    return (
                        <View key={`${dayLabel}-${dayIndex}`} style={styles.singleDayContainer}>
                            {/* Day label (Lu, Ma, Mi, etc.) */}
                            <Text style={styles.dayLabel}>{dayLabel}</Text>
                            
                            {/* Day number circle (clickable) */}
                            <TouchableOpacity 
                                style={getDayContainerStyles(dayNumber)}
                                onPress={() => handleDaySelection(dayNumber)}
                                accessibilityLabel={`Día ${dayNumber}${isToday ? ' (hoy)' : ''}${isSelected ? ' (seleccionado)' : ''}`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected }}
                            >
                                <Text style={getDayTextStyles(dayNumber)}>
                                    {dayNumber}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

/**
 * STYLES
 * 
 * NAMING CONVENTION: [section][element][state]
 * ORGANIZATION: Top-level containers first, then nested elements
 * STATES: Base styles first, then modifier states
 */
const styles = StyleSheet.create({
    // MAIN CONTAINER
    weekCardContainer: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: spacing.xl,
        marginHorizontal: spacing.sm,
        marginVertical: spacing.md,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        width: '95%',
        alignSelf: 'center',
        ...commonStyles.shadowSmall,
    },

    // HEADER SECTION STYLES
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.sm,
    },
    weekTitle: {
        fontSize: 20,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    viewAllButton: {
        fontSize: 14,
        color: colors.textSecondary,
    },

    // MONTH SECTION STYLES
    monthSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    monthName: {
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },

    // WEEK DAYS SECTION STYLES
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    singleDayContainer: {
        alignItems: 'center',
        flex: 1,
        minWidth: 40,
    },
    dayLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        fontWeight: '500',
    },

    // DAY CIRCLE STYLES (Base state)
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // DAY CIRCLE MODIFIER STATES
    todayCircle: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    selectedDayCircle: {
        backgroundColor: colors.primary,
    },

    // DAY NUMBER TEXT STYLES (Base state)
    dayNumber: {
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    
    // DAY NUMBER TEXT MODIFIER STATES
    todayNumber: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    selectedDayNumber: {
        color: colors.white,
        fontWeight: 'bold',
    },
});

export default MyWeek;