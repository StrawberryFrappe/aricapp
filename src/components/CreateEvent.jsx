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
import { commonStyles, spacing } from '../styles/commonStyles';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useCalendarContext } from '../context/CalendarContext';
import { CalendarEvent } from '../models/CalendarModels';
import { useThemedStyles } from '../hooks/useThemedStyles';

const CreateEvent = ({ 
  visible, 
  onClose, 
  preSelectedDate = null,
  eventToEdit = null 
}) => {
  const { colors } = useThemedStyles();
  
  // Dynamic styles based on current theme
  const dynamicStyles = {
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
      color: colors.textSecondary,
      fontSize: 14,
    },
    priorityContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      justifyContent: 'space-around',
    },
    priorityButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.xs,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    priorityButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    priorityText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    priorityTextSelected: {
      color: colors.white,
      fontWeight: 'bold',
    },
    fieldHint: {
      fontSize: 12,
      marginTop: 4,
      fontStyle: 'italic',
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.xs,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
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
      backgroundColor: colors.surfaceLight || colors.surface,
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
    cancelText: {
      color: colors.textPrimary,
      fontSize: 16,
    },
    saveText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: 'bold',
    },
  };
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('non-strict');
  
  // Date/Time state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // default +1h
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Repeat state
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
      setPriority(eventToEdit.priority || 'non-strict');
      
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
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      // Prevent selecting past dates for new events
      if (!eventToEdit && selectedDateOnly < today) {
        Alert.alert('Invalid Date', 'Cannot select past dates for new events');
        return;
      }
      
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
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      // Prevent selecting past dates for new events
      if (!eventToEdit && selectedDateOnly < today) {
        Alert.alert('Invalid Date', 'Cannot select past dates for new events');
        return;
      }
      
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
      
      // Prevent selecting past times for new events on today's date
      if (!eventToEdit) {
        const now = new Date();
        const isToday = newStart.toDateString() === now.toDateString();
        
        if (isToday && newStart < now) {
          Alert.alert('Invalid Time', 'Cannot select past times for events today');
          return;
        }
      }
      
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
      
      // Prevent selecting past times for new events on today's date
      if (!eventToEdit) {
        const now = new Date();
        const isToday = newEnd.toDateString() === now.toDateString();
        
        if (isToday && newEnd < now) {
          Alert.alert('Invalid Time', 'Cannot select past times for events today');
          return;
        }
      }
      
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
    const now = new Date();
    
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Event title is required');
      return false;
    }

    // Check if event is in the past (only for new events, not edits)
    if (!eventToEdit) {
      const eventDateTime = new Date(startDate);
      
      // For timed events, check both date and time
      if (eventDateTime < now) {
        Alert.alert('Validation Error', 'Cannot create events in the past');
        return false;
      }
    }

    if (startDate >= endDate) {
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
        time: startDate.toTimeString().slice(0, 5), // HH:mm format
        priority,
        // Additional metadata can be added here
        repeat: selectedRepeat
      };

      if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData);
      } else {
        // Check if this is a recurring event
        if (selectedRepeat && selectedRepeat !== "Doesn't repeat") {
          await createRecurringEvents(eventData, selectedRepeat);
        } else {
          await createEvent(eventData);
        }
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
   * Create recurring events based on pattern
   */
  const createRecurringEvents = async (baseEventData, repeatPattern) => {
    const occurrences = [];
    const maxOccurrences = 10; // Limit to prevent too many events
    const baseDate = new Date(baseEventData.date);
    const recurringGroupId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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
        recurringGroup: recurringGroupId,
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
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView style={dynamicStyles.scrollViewContent}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerTitle}>
            {eventToEdit ? 'Edit Event' : 'Create Event'}
          </Text>
        </View>

        {/* Title Input */}
        <View style={dynamicStyles.row}>            
          <TextInput
            style={dynamicStyles.titleInput}
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
        <View style={dynamicStyles.row}>
          <TextInput
            style={dynamicStyles.descriptionInput}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={dynamicStyles.separator} />

        {/* Priority Row */}
        <View style={dynamicStyles.itemRow}>
          <View style={dynamicStyles.fieldContainer}>
            <Text style={dynamicStyles.fieldLabel}>App Blocking</Text>
            <View style={dynamicStyles.priorityContainer}>
              {['non-strict', 'strict'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    dynamicStyles.priorityButton,
                    { backgroundColor: priority === p ? colors.primary + '20' : 'transparent' }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[
                    dynamicStyles.priorityText,
                    { color: priority === p ? colors.primary : colors.textSecondary }
                  ]}>
                    {p === 'strict' ? 'Block Apps' : 'Allow Apps'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[dynamicStyles.fieldHint, { color: colors.textSecondary }]}>
              {priority === 'strict' ? 'Distracting apps will be blocked during this event' : 'No app blocking for this event'}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.separator} />

        {/* Date Pickers */}
        <View style={dynamicStyles.fieldContainer}>
          <Text style={dynamicStyles.fieldLabel}>Date</Text>
        </View>
        <View style={dynamicStyles.rangeRow}>
          <TouchableOpacity 
            style={dynamicStyles.rangeItem} 
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={dynamicStyles.itemText}>
              {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity 
            style={dynamicStyles.rangeItem} 
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={dynamicStyles.itemText}>
              {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Pickers */}
        <View style={dynamicStyles.fieldContainer}>
          <Text style={dynamicStyles.fieldLabel}>Time</Text>
        </View>
        <View style={dynamicStyles.rangeRow}>
          <TouchableOpacity 
            style={dynamicStyles.rangeItem} 
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={dynamicStyles.timeText}>
              {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
          <TouchableOpacity 
            style={dynamicStyles.rangeItem} 
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={dynamicStyles.timeText}>
              {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showStartDatePicker && (
          <DateTimePicker 
            value={startDate} 
            mode="date" 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleStartDateChange}
            minimumDate={!eventToEdit ? new Date() : undefined}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker 
            value={endDate} 
            mode="date" 
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
            onChange={handleEndDateChange}
            minimumDate={!eventToEdit ? new Date() : undefined}
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

        <View style={dynamicStyles.separator} />

        {/* Repeat Row */}
        <View style={dynamicStyles.itemRow}>
          <Text style={dynamicStyles.itemText}>Repeat</Text>
          <View style={dynamicStyles.fieldContainer}>
            <TouchableOpacity 
              style={dynamicStyles.dropdownBox} 
              onPress={() => setShowRepeatList(prev => !prev)}
            >
              <Text style={dynamicStyles.dropdownText}>{selectedRepeat}</Text>
              <Ionicons 
                name={showRepeatList ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            {showRepeatList && (
              <View style={dynamicStyles.dropdownList}>
                {["Doesn't repeat", 'Daily', 'Weekly', 'Monthly', 'Yearly'].map(repeat => (
                  <TouchableOpacity 
                    key={repeat} 
                    style={dynamicStyles.dropdownItem} 
                    onPress={() => { 
                      setSelectedRepeat(repeat); 
                      setShowRepeatList(false); 
                    }}
                  >
                    <Text style={dynamicStyles.dropdownItemText}>{repeat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={dynamicStyles.separator} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={dynamicStyles.buttonRow}>
        <TouchableOpacity 
          style={dynamicStyles.cancelButton} 
          onPress={handleCancel}
          disabled={isSaving}
        >
          <Text style={dynamicStyles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[dynamicStyles.saveButton, { opacity: isSaving ? 0.6 : 1 }]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={dynamicStyles.saveText}>
            {isSaving ? 'Saving...' : (eventToEdit ? 'Update' : 'Save')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEvent;
