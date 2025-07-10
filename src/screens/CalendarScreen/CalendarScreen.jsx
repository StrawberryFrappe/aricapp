import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useCalendar } from '../../hooks/useCalendar';
import Calendar from './_components/Calendar';
import EventsContainer from './_components/EventsContainer';
import QuickAddEvent from './_components/QuickAddEvent';
import CreateEvent from '../../components/CreateEvent';
import EventTemplates from './_components/EventTemplates';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
  const [showEventTemplates, setShowEventTemplates] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);

  /**
   * Handle quick add event from calendar date selection
   */
  const handleDateSelect = (date) => {
    setSelectedDateForEvent(date);
    // QuickAdd will use this selected date
  };

  /**
   * Handle full event creation modal
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
    setShowEventTemplates(false);
    setSelectedDateForEvent(null);
    // Refresh events if needed
    calendar.refreshEvents?.();
  };

  /**
   * Handle templates modal
   */
  const handleShowTemplates = () => {
    setSelectedDateForEvent(calendar.viewState?.selectedDate || null);
    setShowEventTemplates(true);
  };

  return (
    <>
      <SafeAreaView style={[localStyles.safeArea, { backgroundColor: colors.background }]}>
        
        <View style={[localStyles.container, { backgroundColor: colors.background }]}>
          {/* Main Calendar Component */}
          <View style={localStyles.calendarSection}>
            <Calendar onDateSelect={handleDateSelect} />
          </View>
          
          {/* Events Section with Quick Add */}
          <View style={localStyles.eventsSection}>
            {/* Quick Add Event Component */}
            <QuickAddEvent 
              selectedDate={selectedDateForEvent}
              onEventCreated={handleEventCreated}
            />
            
            {/* Events Container */}
            <EventsContainer />
            
            {/* Floating Action Buttons */}
            <View style={localStyles.floatingButtons}>
              {/* Templates Button */}
              <TouchableOpacity 
                style={[localStyles.templateButton, { backgroundColor: colors.surface, borderColor: colors.primary }]} 
                onPress={handleShowTemplates}
              >
                <Ionicons name="grid-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              
              {/* Create Event Button */}
              <TouchableOpacity 
                style={[localStyles.createEventContainer, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
                onPress={handleCreateEventPress}
              >
                <Text style={[localStyles.createEventIcon, { color: colors.surface }]}>+</Text>
              </TouchableOpacity>
            </View>
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

      {/* Event Templates Modal */}
      <EventTemplates
        visible={showEventTemplates}
        onClose={() => setShowEventTemplates(false)}
        selectedDate={selectedDateForEvent}
      />
    </>
  );
};

const localStyles = StyleSheet.create({
  floatingButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  templateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  createEventContainer: {
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
    flexDirection: 'column',
  },
  eventsSection: {
    flex: 1,
  },
});

export default CalendarScreen;
