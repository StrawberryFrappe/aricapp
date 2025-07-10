import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../styles/commonStyles';
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
    const cardBackgroundColor = backgroundColor || category?.color || colors.semanticBlue;

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
            <View style={[
                styles.eventCard, 
                { backgroundColor: cardBackgroundColor }
            ]}>
                <View style={styles.eventContent}>
                    <Text style={styles.timeText}>
                        {formatTime(eventData.time)}
                    </Text>
                    <Text style={styles.titleText}>
                        {eventData.title || 'Festival del Ñoqui'}
                    </Text>
                    
                    {/* Show description if available */}
                    {eventData.description && (
                        <Text style={styles.descriptionText} numberOfLines={1}>
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
                            <Text style={styles.priorityText}>
                                {event.priority} priority
                            </Text>
                        </View>
                    )}
                </View>
                
                {showDate && (
                    <Text style={styles.dateText}>
                        {formatDate(eventData.date)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Helper function for priority colors
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return colors.semanticRed;
        case 'medium': return colors.semanticYellow;
        case 'low': return colors.semanticGreen;
        default: return colors.textSecondary;
    }
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
    },
    eventCard: {
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
    },
    eventContent: {
        flex: 1,
    },
    timeText: {
        fontSize: 12,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    titleText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    descriptionText: {
        fontSize: 12,
        color: colors.textPrimary,
        opacity: 0.8,
        marginTop: 2,
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
    priorityText: {
        fontSize: 10,
        color: colors.textPrimary,
        opacity: 0.7,
        textTransform: 'capitalize',
    },
    dateText: {
        fontSize: 12,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});

export default CompactEvent;