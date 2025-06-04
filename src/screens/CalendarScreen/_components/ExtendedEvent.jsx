import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../styles/commonStyles';

const ExtendedEvent = ({ event = {
    title: 'Festival del Ñoqui',
    time: '18:00',
    date: '29 June',
    description: 'A celebration of the traditional ñoqui dish, featuring live music, cooking workshops, and a variety of ñoqui recipes from around the world. Join us for a night of delicious food and cultural festivities.',
    location: 'Plaza Italia, Buenos Aires, Argentina',
    hours: { start: '18:00', end: '23:00' },
} }) => {
    return (
        <View style={styles.container}>
            <View style={styles.eventCard}>
                <View style={styles.eventContent}>
                    <Text style={styles.titleText}>{event.title}</Text>
                </View>
            </View>
            <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>• Fecha y Hora</Text>
                <View style={styles.dateRow}>
                    <Text style={styles.expandedDetail}>Desde: {event.hours.start}</Text>
                    <Text style={styles.expandedDetail}>Hasta: {event.hours.end}</Text>
                </View>
                <Text style={styles.expandedText}>• Descripción</Text>
                <Text style={styles.expandedDetail}>{event.description}</Text>
                <Text style={styles.expandedText}>• Ubicación</Text>
                <Text style={styles.expandedDetail}>{event.location}</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.responseButton}><Text style={styles.responseButtonText}>Asistiré</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.responseButton}><Text style={styles.responseButtonText}>No asistiré</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.responseButton}><Text style={styles.responseButtonText}>Tal vez</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: spacing.lg,
    },    eventCard: {
        backgroundColor: colors.semanticBlue,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventContent: {
        flex: 1,
    },
    titleText: {
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    expandedContent: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: spacing.lg,
        marginTop: -1, // Seamless merge with the event card
    },
    expandedText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    expandedDetail: {
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    },    responseButton: {
        backgroundColor: colors.semanticBlue,
        borderRadius: 5,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    responseButtonText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
});

export default ExtendedEvent;
