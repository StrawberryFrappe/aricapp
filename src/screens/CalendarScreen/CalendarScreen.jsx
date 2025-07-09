import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import Calendar from './_components/Calendar';
import EventsContainer from './_components/EventsContainer';
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

  return (
    <>
      <SafeAreaView style={[localStyles.safeArea, { backgroundColor: colors.background }]}>
        
        <View style={[localStyles.container, { backgroundColor: colors.background }]}>
          {/* Main Calendar Component */}
          <View style={localStyles.calendarSection}>
            <Calendar />
          </View>
            {/* Events Section */}
          <View style={localStyles.eventsSection}>
            <EventsContainer />
            <TouchableOpacity 
              style={[localStyles.createEventContainer, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
              onPress={() => navigation.navigate('CreateTask')}
            >
              <Text style={[localStyles.createEventIcon, { color: colors.semanticYellow }]}>+</Text>
            </TouchableOpacity>
          </View>

        </View>

        
      </SafeAreaView>
      {/* No modal here; navigation pushes CreateTask screen */}
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
    flexDirection: 'column',
  },
  eventsSection: {
    flex: 1,
  },
});

export default CalendarScreen;
