/**
 * Event Templates Component
 * 
 * Common event templates and quick event creation.
 * Provides predefined templates for frequent event types.
 * 
 * @component EventTemplates
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useCalendarContext } from '../../../context/CalendarContext';
import { CalendarCategory } from '../../../models/CalendarModels';

const EventTemplates = ({ 
  visible, 
  onClose, 
  selectedDate = null 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const { createEvent } = useCalendarContext();

  // Predefined event templates
  const eventTemplates = [
    {
      id: 'meeting',
      title: 'Meeting',
      description: 'Team meeting or discussion',
      category: 'Work',
      priority: 'medium',
      duration: 60, // minutes
      icon: 'people-outline',
      color: CalendarCategory.getById('work')?.color || colors.primary
    },
    {
      id: 'workout',
      title: 'Workout',
      description: 'Exercise session',
      category: 'Health',
      priority: 'medium',
      duration: 60,
      icon: 'fitness-outline',
      color: CalendarCategory.getById('health')?.color || colors.primary
    },
    {
      id: 'study',
      title: 'Study Session',
      description: 'Learning or research time',
      category: 'Education',
      priority: 'high',
      duration: 90,
      icon: 'library-outline',
      color: CalendarCategory.getById('education')?.color || colors.primary
    },
    {
      id: 'lunch',
      title: 'Lunch Break',
      description: 'Meal time',
      category: 'Personal',
      priority: 'low',
      duration: 30,
      icon: 'restaurant-outline',
      color: CalendarCategory.getById('personal')?.color || colors.primary
    },
    {
      id: 'travel',
      title: 'Travel',
      description: 'Transportation time',
      category: 'Travel',
      priority: 'medium',
      duration: 30,
      icon: 'car-outline',
      color: CalendarCategory.getById('travel')?.color || colors.primary
    },
    {
      id: 'call',
      title: 'Phone Call',
      description: 'Scheduled call',
      category: 'Work',
      priority: 'medium',
      duration: 30,
      icon: 'call-outline',
      color: CalendarCategory.getById('work')?.color || colors.primary
    },
    {
      id: 'doctor',
      title: 'Doctor Appointment',
      description: 'Medical appointment',
      category: 'Health',
      priority: 'high',
      duration: 60,
      icon: 'medical-outline',
      color: CalendarCategory.getById('health')?.color || colors.primary
    },
    {
      id: 'social',
      title: 'Social Event',
      description: 'Social gathering',
      category: 'Social',
      priority: 'low',
      duration: 120,
      icon: 'happy-outline',
      color: CalendarCategory.getById('social')?.color || colors.primary
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Shopping trip',
      category: 'Personal',
      priority: 'low',
      duration: 60,
      icon: 'bag-outline',
      color: CalendarCategory.getById('personal')?.color || colors.primary
    },
    {
      id: 'hobby',
      title: 'Hobby Time',
      description: 'Personal hobby or interest',
      category: 'Hobby',
      priority: 'low',
      duration: 90,
      icon: 'brush-outline',
      color: CalendarCategory.getById('hobby')?.color || colors.primary
    }
  ];

  // Recurring event patterns
  const recurringPatterns = [
    {
      id: 'daily_standup',
      title: 'Daily Standup',
      description: 'Daily team standup meeting',
      category: 'Work',
      priority: 'medium',
      duration: 15,
      repeat: 'Daily',
      time: '09:00',
      icon: 'people-outline'
    },
    {
      id: 'weekly_review',
      title: 'Weekly Review',
      description: 'Weekly planning and review session',
      category: 'Work',
      priority: 'high',
      duration: 60,
      repeat: 'Weekly',
      time: '17:00',
      icon: 'clipboard-outline'
    },
    {
      id: 'monthly_goals',
      title: 'Monthly Goals Review',
      description: 'Monthly goal setting and review',
      category: 'Personal',
      priority: 'high',
      duration: 90,
      repeat: 'Monthly',
      time: '18:00',
      icon: 'trophy-outline'
    }
  ];

  /**
   * Handle template selection
   */
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  /**
   * Create event from template
   */
  const handleCreateFromTemplate = async (template) => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }

    setIsCreating(true);
    try {
      const now = new Date();
      const defaultTime = template.time || '09:00';
      
      // Calculate end time based on duration
      const startTime = new Date(`${selectedDate}T${defaultTime}`);
      const endTime = new Date(startTime.getTime() + (template.duration * 60000));

      const eventData = {
        title: template.title,
        description: template.description,
        date: selectedDate,
        time: defaultTime,
        category: template.category,
        priority: template.priority,
        isAllDay: false,
        // Add template metadata
        templateId: template.id,
        repeat: template.repeat || "Doesn't repeat"
      };

      // Check if this is a recurring template
      if (template.repeat && template.repeat !== "Doesn't repeat") {
        await createRecurringEvents(eventData, template.repeat);
      } else {
        await createEvent(eventData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating event from template:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Create recurring events based on pattern
   */
  const createRecurringEvents = async (baseEventData, repeatPattern) => {
    const occurrences = [];
    const maxOccurrences = 10; // Limit to prevent too many events
    const baseDate = new Date(baseEventData.date);
    
    for (let i = 0; i < maxOccurrences; i++) {
      const occurrenceDate = new Date(baseDate);
      
      switch (repeatPattern) {
        case 'Daily':
          occurrenceDate.setDate(baseDate.getDate() + i);
          break;
        case 'Weekly':
          occurrenceDate.setDate(baseDate.getDate() + (i * 7));
          break;
        case 'Monthly':
          occurrenceDate.setMonth(baseDate.getMonth() + i);
          break;
        case 'Yearly':
          occurrenceDate.setFullYear(baseDate.getFullYear() + i);
          break;
        default:
          // Single occurrence
          if (i > 0) break;
      }
      
      const eventData = {
        ...baseEventData,
        date: occurrenceDate.toISOString().split('T')[0],
        title: i === 0 ? baseEventData.title : `${baseEventData.title} (${i + 1})`,
        // Add recurring metadata
        isRecurring: true,
        recurringGroup: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        occurenceIndex: i
      };
      
      occurrences.push(eventData);
    }
    
    // Create all recurring events
    for (const eventData of occurrences) {
      await createEvent(eventData);
    }
    
    Alert.alert(
      'Recurring Events Created',
      `Created ${occurrences.length} ${repeatPattern.toLowerCase()} occurrences`
    );
  };

  /**
   * Handle recurring event creation
   */
  const handleCreateRecurring = async (pattern) => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }

    Alert.alert(
      'Create Recurring Event',
      `Create "${pattern.title}" with ${pattern.repeat.toLowerCase()} recurrence?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create',
          onPress: () => handleCreateFromTemplate(pattern)
        }
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Templates</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Selected Date Info */}
          {selectedDate && (
            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>
                Creating event for {new Date(selectedDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          {/* Quick Templates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Templates</Text>
            <View style={styles.templatesGrid}>
              {eventTemplates.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    { borderColor: template.color + '40' }
                  ]}
                  onPress={() => handleCreateFromTemplate(template)}
                  disabled={isCreating}
                >
                  <View style={[
                    styles.templateIcon,
                    { backgroundColor: template.color + '20' }
                  ]}>
                    <Ionicons 
                      name={template.icon} 
                      size={24} 
                      color={template.color} 
                    />
                  </View>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDuration}>
                    {template.duration} min
                  </Text>
                  <Text style={styles.templateCategory}>
                    {template.category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recurring Patterns */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recurring Events</Text>
            {recurringPatterns.map(pattern => (
              <TouchableOpacity
                key={pattern.id}
                style={styles.recurringCard}
                onPress={() => handleCreateRecurring(pattern)}
                disabled={isCreating}
              >
                <View style={styles.recurringIcon}>
                  <Ionicons 
                    name={pattern.icon} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.recurringContent}>
                  <Text style={styles.recurringTitle}>{pattern.title}</Text>
                  <Text style={styles.recurringMeta}>
                    {pattern.repeat} • {pattern.duration} min • {pattern.time}
                  </Text>
                  <Text style={styles.recurringDescription}>
                    {pattern.description}
                  </Text>
                </View>
                <View style={styles.recurringBadge}>
                  <Text style={styles.recurringBadgeText}>
                    {pattern.repeat}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Template */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom</Text>
            <TouchableOpacity 
              style={styles.customCard}
              onPress={onClose} // Will trigger the main CreateEvent flow
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={styles.customText}>Create Custom Event</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  dateInfo: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  templateDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  templateCategory: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recurringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recurringIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recurringContent: {
    flex: 1,
  },
  recurringTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  recurringMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  recurringDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recurringBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  recurringBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    borderStyle: 'dashed',
  },
  customText: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
});

export default EventTemplates;
