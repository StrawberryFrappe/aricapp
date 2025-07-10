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
  TouchableOpacity, 
  Alert, 
  Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
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
  const { styles, colors } = useThemedStyles();
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
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
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
            styles.eventCardContainer,
            { backgroundColor: colors.background, borderColor: colors.borderDefault + '30' },
            event.completed && { opacity: 0.7, backgroundColor: colors.background + 'F0' },
            isDragging && { borderColor: colors.primary, borderWidth: 2 }
          ]}
          disabled={isUpdating}
        >
      {/* Category indicator */}
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      
      <View style={styles.eventCardContent}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Time and priority */}
          <View style={[styles.row, styles.timeSection]}>
            <Text style={[
              styles.smallText,
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
              styles.text,
              styles.titleText,
              event.completed && styles.completedText
            ]}>
              {event.title}
            </Text>
            {event.description && (
              <Text style={[
                styles.smallText,
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
              styles.smallText,
              styles.dateText,
              event.completed && styles.completedText
            ]}>
              {formatDate(event.date)}
            </Text>
          )}
        </View>

        {/* Quick actions */}
        {showQuickActions && (
          <View style={[styles.row, styles.quickActions]}>
            <TouchableOpacity
              onPress={handleToggleComplete}
              style={[
                styles.actionButton,
                { backgroundColor: event.completed ? (colors.warning + '30') : (colors.success + '30') }
              ]}
              disabled={isUpdating}
            >
              <Text style={[styles.text, styles.actionButtonText]}>
                {event.completed ? '↶' : '✓'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.actionButton, { backgroundColor: colors.error + '30' }]}
              disabled={isUpdating}
            >
              <Text style={[styles.text, styles.actionButtonText]}>×</Text>
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

export default EventCard;
