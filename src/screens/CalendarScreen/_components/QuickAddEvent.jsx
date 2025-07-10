/**
 * Quick Add Event Component
 * 
 * Inline event creation component for quick task entry.
 * Provides minimal form with smart defaults and quick category selection.
 * 
 * @component QuickAddEvent
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Animated,
  Alert 
} from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useCalendarContext } from '../../../context/CalendarContext';
import { CalendarCategory } from '../../../models/CalendarModels';

const QuickAddEvent = ({ 
  selectedDate, 
  onEventCreated = null,
  style = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Travel');
  const [showCategories, setShowCategories] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { createEvent } = useCalendarContext();
  const titleInputRef = useRef(null);
  const animatedHeight = useRef(new Animated.Value(50)).current;

  /**
   * Expand the quick add form
   */
  const handleExpand = () => {
    setIsExpanded(true);
    Animated.timing(animatedHeight, {
      toValue: 120,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      titleInputRef.current?.focus();
    });
  };

  /**
   * Collapse the quick add form
   */
  const handleCollapse = () => {
    setIsExpanded(false);
    setTitle('');
    setShowCategories(false);
    titleInputRef.current?.blur();
    
    Animated.timing(animatedHeight, {
      toValue: 50,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Handle quick event creation
   */
  const handleQuickCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Event title is required');
      return;
    }

    setIsCreating(true);
    try {
      const now = new Date();
      const eventDate = selectedDate || now.toISOString().split('T')[0];
      
      // Set default time based on current time or 9 AM for future dates
      let defaultTime = '09:00';
      if (eventDate === now.toISOString().split('T')[0]) {
        // If today, use current time rounded up to next hour
        const nextHour = new Date(now.getTime() + 3600000);
        nextHour.setMinutes(0, 0, 0);
        defaultTime = nextHour.toTimeString().slice(0, 5);
      }

      const eventData = {
        title: title.trim(),
        date: eventDate,
        time: defaultTime,
        category: selectedCategory,
        priority: 'medium',
        isAllDay: false
      };

      await createEvent(eventData);
      
      // Reset form
      setTitle('');
      handleCollapse();
      
      // Notify parent if callback provided
      if (onEventCreated) {
        onEventCreated(eventData);
      }

    } catch (error) {
      console.error('Error creating quick event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Handle category selection
   */
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  return (
    <Animated.View style={[styles.container, style, { height: animatedHeight }]}>
      {!isExpanded ? (
        // Collapsed state - Simple add button
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleExpand}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Quick add event</Text>
        </TouchableOpacity>
      ) : (
        // Expanded state - Quick form
        <View style={styles.expandedContainer}>
          {/* Title input row */}
          <View style={styles.inputRow}>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="Event title"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
              onSubmitEditing={handleQuickCreate}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCollapse}
            >
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Category and action row */}
          <View style={styles.actionRow}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity 
                style={styles.categoryButton}
                onPress={() => setShowCategories(!showCategories)}
              >
                <View style={[
                  styles.categoryIndicator,
                  { backgroundColor: CalendarCategory.getById(selectedCategory.toLowerCase())?.color || colors.primary }
                ]} />
                <Text style={styles.categoryText}>{selectedCategory}</Text>
                <Ionicons 
                  name={showCategories ? 'chevron-up' : 'chevron-down'} 
                  size={14} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {/* Category dropdown */}
              {showCategories && (
                <View style={styles.categoryDropdown}>
                  {CalendarCategory.getNames().slice(0, 4).map(category => { // Show first 4 categories
                    const categoryData = CalendarCategory.getById(category.toLowerCase());
                    return (
                      <TouchableOpacity
                        key={category}
                        style={styles.categoryOption}
                        onPress={() => handleCategorySelect(category)}
                      >
                        <View style={[
                          styles.categoryIndicator,
                          { backgroundColor: categoryData?.color || colors.primary }
                        ]} />
                        <Text style={styles.categoryOptionText}>{category}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.createButton,
                { opacity: isCreating || !title.trim() ? 0.6 : 1 }
              ]}
              onPress={handleQuickCreate}
              disabled={isCreating || !title.trim()}
            >
              <Text style={styles.createButtonText}>
                {isCreating ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border + '30',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  addButtonText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  expandedContainer: {
    flex: 1,
    padding: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flex: 1,
    position: 'relative',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginRight: spacing.md,
  },
  categoryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginRight: spacing.xs,
    fontWeight: '500',
  },
  categoryDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    zIndex: 999,
    elevation: 5,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: spacing.xs,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
  },
  createButtonText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: '600',
  },
});

export default QuickAddEvent;
