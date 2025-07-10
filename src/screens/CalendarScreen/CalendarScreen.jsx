import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useCalendar } from '../../hooks/useCalendar';
import Calendar from './_components/Calendar';
import EventsContainer from './_components/EventsContainer';
import CreateEvent from '../../components/CreateEvent';
import { useNavigation } from '@react-navigation/native';

/**
 * Calendar Screen Component
 * 
 * Main calendar interface showing monthly calendar view and upcoming events.
 * Displays calendar grid for April 2025 with navigation and events list below.
 * 
 * @function CalendarScreen
 * @returns {JSX.Element} Complete calendar interface with month view and events
 */
const CalendarScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemedStyles();
  const calendar = useCalendar();
  
  // Modal state for event creation
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);

  /**
   * Handle date selection from calendar
   */
  const handleDateSelect = (date) => {
    setSelectedDateForEvent(date);
  };

  /**
   * Handle create event button press
   */
  const handleCreateEventPress = () => {
    setSelectedDateForEvent(calendar.viewState?.selectedDate || null);
    setShowCreateEvent(true);
  };

  /**
   * Handle event creation completion
   */
  const handleEventCreated = () => {
    setShowCreateEvent(false);
    setSelectedDateForEvent(null);
    // Refresh events if needed
    calendar.refreshEvents?.();
  };

  return (
    <>
      <SafeAreaView style={[localStyles.safeArea, { backgroundColor: colors.background }]}>
        
        <View style={[localStyles.container, { backgroundColor: colors.background }]}>
          {/* Main Calendar Component */}
          <View style={localStyles.calendarSection}>
            <Calendar onDateSelect={handleDateSelect} />
          </View>
          
          {/* Events Section */}
          <View style={localStyles.eventsSection}>
            {/* Events Container */}
            <EventsContainer />
            
            {/* Floating Action Button for Full Event Creation */}
            <TouchableOpacity 
              style={[localStyles.createEventContainer, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
              onPress={handleCreateEventPress}
            >
              <Text style={[localStyles.createEventIcon, { color: colors.surface }]}>+</Text>
            </TouchableOpacity>
          </View>

        </View>

        
      </SafeAreaView>
      
      {/* Create Event Modal */}
      <Modal
        visible={showCreateEvent}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateEvent(false)}
      >
        <CreateEvent
          visible={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
          preSelectedDate={selectedDateForEvent}
        />
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  createEventContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createEventIcon: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
  },  
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },  
  calendarSection: {
    flex: 2, // Give calendar more space
    flexDirection: 'column',
  },
  eventsSection: {
    flex: 1, // Events take remaining space
  },
});

export default CalendarScreen;
