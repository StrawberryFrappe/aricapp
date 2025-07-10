/**
 * Event Card Component
 * 
 * Compact event display with priority indicators and quick actions.
 * Supports complete/delete actions and shows event details.
 * Now includes EditEvent modal integration.
 * 
 * @component EventCard
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../../styles/commonStyles';
import { useCalendar } from '../../../hooks/useCalendar';
import { CalendarCategory } from '../../../models/CalendarModels';
import EditEvent from './EditEvent';

const EventCard = ({ 
  event, 
  showDate = true, 
  showQuickActions = true,
  onPress = null,
  enableDragReschedule = true,
  onDragReschedule = null 
}) => {
  const navigation = useNavigation();
  const { updateEvent, deleteEvent } = useCalendar();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Animation refs for visual feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
      // Open edit modal instead of navigation
      setShowEditModal(true);
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

  /**
   * Handle long press to enable reschedule mode
   */
  const handleLongPress = () => {
    if (!enableDragReschedule) return;
    
    setIsDragging(true);
    
    // Scale animation for feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    // Show reschedule options
    Alert.alert(
      'Reschedule Event',
      'How would you like to reschedule this event?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setIsDragging(false) },
        { 
          text: 'Edit Date/Time', 
          onPress: () => {
            setIsDragging(false);
            setShowEditModal(true);
          }
        },
        { 
          text: 'Move to Tomorrow', 
          onPress: () => handleQuickReschedule(1)
        },
        { 
          text: 'Move to Next Week', 
          onPress: () => handleQuickReschedule(7)
        }
      ]
    );
  };

  /**
   * Handle quick reschedule (move by days)
   */
  const handleQuickReschedule = async (daysToAdd) => {
    try {
      setIsUpdating(true);
      const currentDate = new Date(event.date);
      const newDate = new Date(currentDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      
      await updateEvent(event.id, {
        date: newDate.toISOString().split('T')[0]
      });
      
      Alert.alert('Success', `Event moved to ${newDate.toLocaleDateString()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to reschedule event');
    } finally {
      setIsUpdating(false);
      setIsDragging(false);
    }
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          onPress={handlePress}
          onLongPress={enableDragReschedule ? handleLongPress : undefined}
          delayLongPress={500}
          style={[
            styles.container,
            event.completed && styles.completedContainer,
            isDragging && styles.draggingContainer
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
    </Animated.View>

    {/* Edit Event Modal */}
    {showEditModal && (
      <EditEvent
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        event={event}
      />
    )}
    </>
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
  draggingContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.2,
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
