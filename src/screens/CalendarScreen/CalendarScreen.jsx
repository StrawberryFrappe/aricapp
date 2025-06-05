import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../styles/commonStyles';
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
              <Text style={{...commonStyles.iconLarge, color: colors.semanticYellow}}>+</Text>
            </TouchableOpacity>
          </View>

        </View>

        
      </SafeAreaView>
      {/* No modal here; navigation pushes CreateTask screen */}
    </>
  );
};

const styles = StyleSheet.create({
  createEventContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerLarge,
    ...commonStyles.shadowMedium,
    alignSelf: 'flex-end',
    marginRight: spacing.md,
  },
  centralLabel: {
    fontSize: 12,
    color: colors.black,
    marginTop: spacing.md,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },  
  container: {
    // ensure the container hugs the content vertically
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },  
  calendarSection: {
    // compress vertically to fit content
    flexDirection: 'column',
    
  },
  eventsSection: {
    flex: 1,
  },  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',

    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    
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
