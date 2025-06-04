import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../../styles/commonStyles';

const CompactEvent = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('ExtendedEvent', {
            event: {
                title: 'Festival del Ñoqui',
                time: '18:00',
                date: '29 June',
                description: 'A celebration of the traditional ñoqui dish, featuring live music, cooking workshops, and a variety of ñoqui recipes from around the world. Join us for a night of delicious food and cultural festivities.',
                location: 'Plaza Italia, Buenos Aires, Argentina',
                hours: { start: '18:00', end: '23:00' },
            },
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <View style={styles.eventCard}>
                <View style={styles.eventContent}>
                    <Text style={styles.timeText}>18:00</Text>
                    <Text style={styles.titleText}>Festival del Ñoqui</Text>
                </View>
                <Text style={styles.dateText}>29 June</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
    },
    eventCard: {
        backgroundColor: '#A5D6A7',
        borderRadius: 10,
        padding: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 60,
    },
    eventContent: {
        flex: 1,
    },
    timeText: {
        fontSize: 12,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    titleText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});

export default CompactEvent;