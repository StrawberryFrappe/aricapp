/**
 * Event Card Component
 * 
 * Compact event display with priority indicators and quick actions.
 * Supports complete/delete actions and shows event details.
 * 
 * @component EventCard
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import { CalendarCategory } from '../../../models/CalendarModels';

const EventCard = ({ 
  event, 
  showDate = true, 
  showQuickActions = true,
  onPress = null 
}) => {
  const navigation = useNavigation();
  const { updateEvent, deleteEvent } = useCalendar();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get category info
  const category = CalendarCategory.getById(event.category);
  const categoryColor = category?.color || colors.primary;

  // Priority colors
  const getPriorityColor = () => {
    switch (event.priority) {
      case 'high': return colors.semanticRed;
      case 'medium': return colors.semanticYellow;
      case 'low': return colors.semanticGreen;
      default: return colors.textSecondary;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(event);
    } else {
      navigation.navigate('CreateTask', {
        event: event,
        mode: 'edit'
      });
    }
  };

  const handleToggleComplete = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateEvent(event.id, {
        completed: !event.completed
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update event');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  const formatTime = (time) => {
    if (event.isAllDay) return 'All day';
    return time;
  };

  const formatDate = (date) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[
        styles.container,
        event.completed && styles.completedContainer
      ]}
      disabled={isUpdating}
    >
      {/* Category indicator */}
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      
      <View style={styles.content}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Time and priority */}
          <View style={styles.timeSection}>
            <Text style={[
              styles.timeText,
              event.completed && styles.completedText
            ]}>
              {formatTime(event.time)}
            </Text>
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: getPriorityColor() }
            ]} />
          </View>

          {/* Title and description */}
          <View style={styles.eventDetails}>
            <Text style={[
              styles.titleText,
              event.completed && styles.completedText
            ]}>
              {event.title}
            </Text>
            {event.description && (
              <Text style={[
                styles.descriptionText,
                event.completed && styles.completedText
              ]} numberOfLines={2}>
                {event.description}
              </Text>
            )}
          </View>

          {/* Date (if shown) */}
          {showDate && (
            <Text style={[
              styles.dateText,
              event.completed && styles.completedText
            ]}>
              {formatDate(event.date)}
            </Text>
          )}
        </View>

        {/* Quick actions */}
        {showQuickActions && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={handleToggleComplete}
              style={[
                styles.actionButton,
                event.completed ? styles.undoButton : styles.completeButton
              ]}
              disabled={isUpdating}
            >
              <Text style={styles.actionButtonText}>
                {event.completed ? '↶' : '✓'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.actionButton, styles.deleteButton]}
              disabled={isUpdating}
            >
              <Text style={styles.actionButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border + '30',
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: colors.background + 'F0',
  },
  categoryIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  mainContent: {
    flex: 1,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDetails: {
    marginBottom: spacing.xs,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  quickActions: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  completeButton: {
    backgroundColor: colors.semanticGreen + '30',
  },
  undoButton: {
    backgroundColor: colors.semanticYellow + '30',
  },
  deleteButton: {
    backgroundColor: colors.semanticRed + '30',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EventCard;
