import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
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
  const { styles, colors } = useThemedStyles(createStyles);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.container}>
          {/* Main Calendar Component */}
          <View style={styles.calendarSection}>
            <Calendar />
          </View>
            {/* Events Section */}
          <View style={styles.eventsSection}>
            <EventsContainer />
            <TouchableOpacity style={styles.createEventContainer} onPress={() => navigation.navigate('CreateTask')}>
              <Text style={styles.createEventIcon}>+</Text>
            </TouchableOpacity>
          </View>

        </View>

        
      </SafeAreaView>
      {/* No modal here; navigation pushes CreateTask screen */}
    </>
  );
};

const createStyles = (colors) => ({
  createEventContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createEventIcon: {
    fontSize: 30,
    color: colors.semanticYellow,
    fontWeight: 'bold',
  },
  centralLabel: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },  
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },  
  calendarSection: {
    flexDirection: 'column',
  },
  eventsSection: {
    flex: 1,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  eventsTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  eventsHighlight: {
    color: colors.primary,
  },
});

export default CalendarScreen;
