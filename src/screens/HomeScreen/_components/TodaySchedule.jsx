import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useCalendar } from '../../../hooks/useCalendar';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import CompactEvent from '../../../components/CompactEvent';
import CreateEvent from '../../../components/CreateEvent';
import EditEvent from '../../CalendarScreen/_components/EditEvent';

// Generate array of hours 0-23
const hours = Array.from({ length: 24 }, (_, i) => i);

const TodaySchedule = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [quickAddText, setQuickAddText] = useState('');
  
  const { styles: themedStyles, colors: themeColors } = useThemedStyles();
  const { getEventsByDate, dateUtils, createEvent, navigateToDate } = useCalendar();
  
  const hourHeight = 60;

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const pos = now.getHours() * hourHeight + now.getMinutes() * (hourHeight / 60);
      setCurrentPosition(pos);
    };
    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get events for the selected date
  const dayEvents = getEventsByDate(selectedDate);
  
  // Navigation functions
  const navigateToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    navigateToDate(newDate);
  };

  const navigateToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    navigateToDate(newDate);
  };

  const navigateToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    navigateToDate(today);
  };

  // Event handlers
  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleQuickAdd = async () => {
    if (quickAddText.trim()) {
      const newEvent = {
        title: quickAddText.trim(),
        date: selectedDate,
        time: new Date().toTimeString().slice(0, 5), // Current time
        category: 'personal'
      };
      
      try {
        await createEvent(newEvent);
        setQuickAddText('');
      } catch (error) {
        console.error('Error creating quick event:', error);
      }
    } else {
      setShowCreateModal(true);
    }
  };

  // Get event for a specific hour
  const getEventForHour = (hour) => {
    return dayEvents.find(event => {
      if (event.isAllDay) return false;
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventHour === hour;
    });
  };

  const displayDate = new Date(selectedDate + 'T00:00:00');
  const isToday = dateUtils.isToday(selectedDate);
  const monthName = displayDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const dayNumber = displayDate.getDate();
  const dayName = displayDate.toLocaleString('default', { weekday: 'long' });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={navigateToPreviousDay} style={styles.navButton}>
            <Ionicons name="chevron-back" size={20} color={themeColors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={navigateToToday} style={styles.dateContainer}>
            <Text style={[styles.monthText, { color: themeColors.textSecondary }]}>
              {monthName}
            </Text>
            <View style={styles.dateRow}>
              <View style={[styles.dateBox, { backgroundColor: isToday ? themeColors.primary : themeColors.surface }]}>
                <Text style={[styles.dateNumber, { color: isToday ? themeColors.white : themeColors.textPrimary }]}>
                  {dayNumber}
                </Text>
              </View>
              <Text style={[styles.dayText, { color: themeColors.textPrimary }]}>
                {dayName}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={navigateToNextDay} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {dayEvents.length > 0 && (
          <Text style={[styles.eventCount, { color: themeColors.textSecondary }]}>
            {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} today
          </Text>
        )}
      </View>

      <View style={styles.timelineContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* All-day events section */}
          {dayEvents.filter(event => event.isAllDay).length > 0 && (
            <View style={styles.allDaySection}>
              <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
                All Day
              </Text>
              {dayEvents.filter(event => event.isAllDay).map(event => (
                <CompactEvent
                  key={event.id}
                  event={event}
                  showDate={false}
                  onPress={handleEventPress}
                />
              ))}
            </View>
          )}

          {/* Hourly timeline */}
          {hours.map(hour => {
            const hourEvent = getEventForHour(hour);
            return (
              <View key={hour} style={[styles.hourRow, { height: hourHeight }]}>  
                <Text style={[styles.hourLabel, { color: themeColors.textSecondary }]}>
                  {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}
                </Text>
                <View style={styles.timeSlotContent}>
                  <View style={[styles.line, { backgroundColor: themeColors.borderLight }]} />
                  {hourEvent && (
                    <View style={styles.eventInTimeline}>
                      <CompactEvent
                        event={hourEvent}
                        showDate={false}
                        onPress={handleEventPress}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          
          {/* Current time indicator - only show for today */}
          {isToday && (
            <View style={[styles.currentLine, { 
              top: currentPosition,
              backgroundColor: themeColors.accent 
            }]} />
          )}
        </ScrollView>
      </View>

      <View style={[styles.bottomBar, { backgroundColor: themeColors.surfaceLight }]}>
        <TextInput
          style={[styles.input, { color: themeColors.textPrimary }]}
          placeholder={`Add event on ${monthName} ${dayNumber}`}
          placeholderTextColor={themeColors.textMuted}
          value={quickAddText}
          onChangeText={setQuickAddText}
          onSubmitEditing={handleQuickAdd}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.primary }]} 
          onPress={handleQuickAdd}
        >
          <Ionicons name="add" size={24} color={themeColors.white} />
        </TouchableOpacity>
      </View>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <CreateEvent 
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          preSelectedDate={selectedDate}
        />
      </Modal>

      {/* Edit Event Modal */}
      <EditEvent
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  monthText: {
    ...commonStyles.titleText,
    fontSize: 18,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dateNumber: {
    ...commonStyles.titleText,
  },
  dayText: {
    ...commonStyles.bodyText,
  },
  eventCount: {
    ...commonStyles.smallText,
    marginTop: 8,
    fontStyle: 'italic',
  },
  timelineContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingBottom: 100,
  },
  allDaySection: {
    marginBottom: 20,
    paddingRight: 20,
  },
  sectionTitle: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourLabel: {
    width: 60,
    ...commonStyles.smallText,
    paddingTop: 5,
  },
  timeSlotContent: {
    flex: 1,
    position: 'relative',
  },
  line: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: 8,
  },
  eventInTimeline: {
    position: 'absolute',
    top: -25,
    left: 10,
    right: 20,
    zIndex: 1,
  },
  currentLine: {
    position: 'absolute',
    left: 80,
    right: 20,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
    zIndex: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default TodaySchedule;
