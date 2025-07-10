/**
 * Create Event Component
 * 
 * Enhanced event creation interface with calendar integration.
 * Refactored from CreateTask.jsx with improved validation, 
 * calendar context integration, and better UX.
 * 
 * @component CreateEvent
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Switch, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Alert 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, colors, spacing } from '../styles/commonStyles';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useCalendarContext } from '../context/CalendarContext';
import { CalendarEvent, CalendarCategory } from '../models/CalendarModels';

const CreateEvent = ({ 
  visible, 
  onClose, 
  preSelectedDate = null,
  eventToEdit = null 
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Travel');
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [isAllDay, setIsAllDay] = useState(false);
  
  // Date/Time state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // default +1h
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Reminder and repeat state
  const [selectedReminder, setSelectedReminder] = useState('10 minutes before');
  const [showReminderList, setShowReminderList] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState("Doesn't repeat");
  const [showRepeatList, setShowRepeatList] = useState(false);

  // Calendar context
  const { createEvent, updateEvent, loading } = useCalendarContext();

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Initialize form with pre-selected date or event data
   */
  useEffect(() => {
    if (eventToEdit) {
      // Populate form for editing
      setTitle(eventToEdit.title || '');
      setDescription(eventToEdit.description || '');
      setSelectedCategory(eventToEdit.category || 'Travel');
      setPriority(eventToEdit.priority || 'medium');
      setIsAllDay(eventToEdit.isAllDay || false);
      
      // Parse date and time
      if (eventToEdit.date) {
        const eventDate = new Date(eventToEdit.date + 'T' + (eventToEdit.time || '09:00'));
        setStartDate(eventDate);
        setEndDate(new Date(eventDate.getTime() + 3600000)); // +1 hour default
      }
    } else if (preSelectedDate) {
      // Set date from calendar selection
      const selectedDate = new Date(preSelectedDate);
      const now = new Date();
      
      // If selected date is today or future, use current time
      // If selected date is past, set to 9 AM
      if (selectedDate.toDateString() === now.toDateString()) {
        setStartDate(now);
        setEndDate(new Date(now.getTime() + 3600000));
      } else {
        selectedDate.setHours(9, 0, 0, 0);
        setStartDate(selectedDate);
        setEndDate(new Date(selectedDate.getTime() + 3600000));
      }
    }
  }, [eventToEdit, preSelectedDate]);

  /**
   * Handle date picker changes
   */
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // Ensure end date is after start date
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 3600000));
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      // Ensure end date is not before start date
      if (selectedDate < startDate) {
        setEndDate(startDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newStart = new Date(startDate);
      newStart.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setStartDate(newStart);
      
      // Ensure end time is after start time
      if (newStart >= endDate) {
        setEndDate(new Date(newStart.getTime() + 3600000));
      }
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEnd = new Date(endDate);
      newEnd.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      
      // Ensure end time is after start time
      if (newEnd <= startDate) {
        setEndDate(new Date(startDate.getTime() + 3600000));
      } else {
        setEndDate(newEnd);
      }
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Event title is required');
      return false;
    }

    if (startDate >= endDate && !isAllDay) {
      Alert.alert('Validation Error', 'End time must be after start time');
      return false;
    }

    return true;
  };

  /**
   * Handle save event
   */
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time: isAllDay ? '00:00' : startDate.toTimeString().slice(0, 5), // HH:mm format
        isAllDay,
        category: selectedCategory,
        priority,
        // Additional metadata can be added here
        reminder: selectedReminder,
        repeat: selectedRepeat
      };

      if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData);
      } else {
        await createEvent(eventData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {eventToEdit ? 'Edit Event' : 'Create Event'}
          </Text>
        </View>

        {/* Title Input */}
        <View style={styles.row}>            
          <TextInput
            style={styles.titleInput}
            placeholder="Event title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus={!eventToEdit}
          />
          <TouchableOpacity>
            <Entypo name="emoji-happy" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Description Input */}
        <View style={styles.row}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.separator} />

        {/* Category & Priority Row */}
        <View style={styles.itemRow}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity 
              style={styles.dropdownBox} 
              onPress={() => setShowCategoryList(prev => !prev)}
            >
              <Text style={styles.dropdownText}>{selectedCategory}</Text>
              <Ionicons 
                name={showCategoryList ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            {showCategoryList && (
              <View style={styles.dropdownList}>
                {CalendarCategory.getNames().map(category => (
                  <TouchableOpacity 
                    key={category} 
                    style={styles.dropdownItem} 
                    onPress={() => { 
                      setSelectedCategory(category); 
                      setShowCategoryList(false); 
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    { backgroundColor: priority === p ? colors.primary + '20' : 'transparent' }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[
                    styles.priorityText,
                    { color: priority === p ? colors.primary : colors.textSecondary }
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* All Day Toggle */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>All Day</Text>
          <Switch
            value={isAllDay}
            onValueChange={setIsAllDay}
            thumbColor={isAllDay ? colors.primary : colors.surface}
            trackColor={{ true: colors.primaryLight, false: colors.borderLight }}
          />
        </View>

        <View style={styles.separator} />

        {/* Date Pickers */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date</Text>
        </View>
        <View style={styles.rangeRow}>
          <TouchableOpacity 
            style={styles.rangeItem} 
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.itemText}>
              {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {!isAllDay && (
            <>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
              <TouchableOpacity 
                style={styles.rangeItem} 
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.itemText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Time Pickers (only if not all day) */}
        {!isAllDay && (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Time</Text>
            </View>
            <View style={styles.rangeRow}>
              <TouchableOpacity 
                style={styles.rangeItem} 
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.timeText}>
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
              <TouchableOpacity 
                style={styles.rangeItem} 
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.timeText}>
                  {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Date/Time Pickers */}
        {showStartDatePicker && (
          <DateTimePicker 
            value={startDate} 
            mode="date" 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker 
            value={endDate} 
            mode="date" 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleEndDateChange}
          />
        )}
        {showStartTimePicker && (
          <DateTimePicker 
            value={startDate} 
            mode="time" 
            is24Hour 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleStartTimeChange}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker 
            value={endDate} 
            mode="time" 
            is24Hour 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleEndTimeChange}
          />
        )}

        <View style={styles.separator} />

        {/* Reminder Row */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Reminder</Text>
          <View style={styles.fieldContainer}>
            <TouchableOpacity 
              style={styles.dropdownBox} 
              onPress={() => setShowReminderList(prev => !prev)}
            >
              <Text style={styles.dropdownText}>{selectedReminder}</Text>
              <Ionicons 
                name={showReminderList ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            {showReminderList && (
              <View style={styles.dropdownList}>
                {['None', '10 minutes before', '30 minutes before', '1 hour before', '1 day before'].map(reminder => (
                  <TouchableOpacity 
                    key={reminder} 
                    style={styles.dropdownItem} 
                    onPress={() => { 
                      setSelectedReminder(reminder); 
                      setShowReminderList(false); 
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{reminder}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.separator} />

        {/* Repeat Row */}
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Repeat</Text>
          <View style={styles.fieldContainer}>
            <TouchableOpacity 
              style={styles.dropdownBox} 
              onPress={() => setShowRepeatList(prev => !prev)}
            >
              <Text style={styles.dropdownText}>{selectedRepeat}</Text>
              <Ionicons 
                name={showRepeatList ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            {showRepeatList && (
              <View style={styles.dropdownList}>
                {["Doesn't repeat", 'Daily', 'Weekly', 'Monthly', 'Yearly'].map(repeat => (
                  <TouchableOpacity 
                    key={repeat} 
                    style={styles.dropdownItem} 
                    onPress={() => { 
                      setSelectedRepeat(repeat); 
                      setShowRepeatList(false); 
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{repeat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.separator} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={isSaving}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveButton, { opacity: isSaving ? 0.6 : 1 }]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveText}>
            {isSaving ? 'Saving...' : (eventToEdit ? 'Update' : 'Save')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollViewContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  titleInput: {
    flex: 1,
    fontSize: 22,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  itemText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  fieldContainer: { 
    flex: 1, 
    position: 'relative' 
  },
  fieldLabel: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  dropdownBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: colors.borderLight,
    borderRadius: 8, 
    paddingHorizontal: spacing.md, 
    paddingVertical: spacing.sm,
    flex: 1, 
    marginLeft: spacing.md,
  },
  dropdownText: { 
    flex: 1, 
    color: colors.textPrimary, 
    fontSize: 16 
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: spacing.md,
    right: 0,
    zIndex: 999,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: { 
    paddingVertical: spacing.sm, 
    paddingHorizontal: spacing.md 
  },
  dropdownItemText: { 
    fontSize: 16, 
    color: colors.textPrimary 
  },
  priorityContainer: {
    flexDirection: 'row',
    marginLeft: spacing.md,
  },
  priorityButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.xs,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rangeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelButton: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cancelText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  saveButton: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  saveText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEvent;
