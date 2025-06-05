import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';
import CompactEvent from '../../../components/CompactEvent';

const EventsContainer = () => {
    // Sample events data from the image
    const events = [
        {
            id: 1,
            time: '10:15 PM',
            title: 'Plato Único Bailable',
            date: '10 Abril'
        },
        {
            id: 2,
            time: '10:15 PM',
            title: 'Plato Único Bailable',
            date: '25 Abril'
        }
    ];    return (
        
        <ScrollView style={[styles.eventsScrollView, styles.container]} showsVerticalScrollIndicator={false}>
                {events.map((event) => (
                    <CompactEvent
                        key={event.id}
                        time={event.time}
                        title={event.title}
                        date={event.date}
                    />
                ))}
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({    
    container: {
        flexDirection: 'column',
        paddingHorizontal: spacing.md,
    },
    header: {
        marginBottom: spacing.lg,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    eventsText: {
        color: colors.primary,
    },    
    eventsScrollView: {
        paddingTop: spacing.md,
        flexGrow: 0, // Added to make the ScrollView hug its content
    },
});

export default EventsContainer;