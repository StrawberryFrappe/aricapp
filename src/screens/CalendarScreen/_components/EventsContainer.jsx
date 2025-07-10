import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../styles/commonStyles';
import EventsList from './EventsList';

/**
 * Events Container Component
 * 
 * Container for displaying events list in the calendar screen.
 * Uses the new EventsList component with proper calendar integration.
 * 
 * @component EventsContainer
 */
const EventsContainer = () => {
    return (
        <View style={styles.container}>
            <EventsList />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
});

export default EventsContainer;