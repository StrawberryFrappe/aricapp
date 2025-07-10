import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../styles/commonStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { CalendarCategory } from '../models/CalendarModels';

/**
 * Compact Event Component
 * 
 * Updated for calendar compatibility with proper prop handling and theming.
 * Supports both legacy props and new calendar event objects.
 * 
 * @component CompactEvent
 */
const CompactEvent = ({ 
    // Legacy props for backward compatibility
    title, 
    time, 
    date, 
    description, 
    location, 
    hours,
    
    // New calendar props
    event,
    showDate = true,
    backgroundColor = null,
    onPress = null
}) => {
    const navigation = useNavigation();
    const { colors } = useThemedStyles();

    // Use event object if provided, otherwise use individual props
    const eventData = event || {
        title,
        time,
        date,
        description,
        location,
        hours
    };

    // Get category color if available
    const category = event?.category ? CalendarCategory.getById(event.category) : null;
    const cardBackgroundColor = backgroundColor || category?.color || colors.primary;

    // Helper function for priority colors
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'strict': return colors.error;
            case 'non-strict': return colors.textSecondary;
            default: return colors.textSecondary;
        }
    };

    // Dynamic styles using inline objects (no StyleSheet.create)
    const eventCardStyle = {
        borderRadius: 10,
        padding: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 60,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: cardBackgroundColor,
    };

    const timeTextStyle = {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    };

    const titleTextStyle = {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    };

    const descriptionTextStyle = {
        fontSize: 12,
        color: colors.textPrimary,
        marginTop: 4,
    };

    const priorityTextStyle = {
        fontSize: 10,
        fontWeight: '500',
        marginLeft: 6,
        color: colors.textPrimary,
    };

    const dateTextStyle = {
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: 'right',
    };

    const handlePress = () => {
        if (onPress) {
            onPress(eventData);
        } else {
            navigation.navigate('CreateTask', {
                event: eventData,
                mode: event?.id ? 'edit' : 'create'
            });
        }
    };

    const formatTime = (timeValue) => {
        if (event?.isAllDay) return 'All day';
        return timeValue || '18:00';
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '29 June';
        
        // Handle different date formats
        if (typeof dateValue === 'string' && dateValue.includes('-')) {
            // ISO format (YYYY-MM-DD)
            const date = new Date(dateValue);
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short'
            });
        }
        
        return dateValue;
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <View style={eventCardStyle}>
                <View style={styles.eventContent}>
                    <Text style={timeTextStyle}>
                        {formatTime(eventData.time)}
                    </Text>
                    <Text style={titleTextStyle}>
                        {eventData.title || 'Festival del Ñoqui'}
                    </Text>
                    
                    {/* Show description if available */}
                    {eventData.description && (
                        <Text style={descriptionTextStyle} numberOfLines={1}>
                            {eventData.description}
                        </Text>
                    )}
                    
                    {/* Show priority indicator if available */}
                    {event?.priority && (
                        <View style={styles.priorityContainer}>
                            <View style={[
                                styles.priorityDot,
                                { backgroundColor: getPriorityColor(event.priority) }
                            ]} />
                            <Text style={priorityTextStyle}>
                                {event.priority === 'strict' ? 'Apps blocked' : 'Apps allowed'}
                            </Text>
                        </View>
                    )}
                </View>
                
                {showDate && (
                    <Text style={dateTextStyle}>
                        {formatDate(eventData.date)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
    },
    eventContent: {
        flex: 1,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: spacing.xs,
    },
});

export default CompactEvent;