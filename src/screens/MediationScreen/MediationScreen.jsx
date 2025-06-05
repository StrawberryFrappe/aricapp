import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../../styles/commonStyles';
import SectionHeader from './_components/SectionHeader';
import MediationCard from './_components/MediationCard';


/**
 * MediationScreen Component
 * This component displays the user's mediations, both public and private.
 * It shows a list of public mediations and private messages, with navigation
 * to specific mediation details.
 *
 * @function MediationScreen
 * @returns {JSX.Element}
 */

const MediationScreen = () => {
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tus Mediaciones</Text>
        </View>

        {/* Public Mediations Section */}
        <SectionHeader title="Mediaciones Publicas" icon={<UsersIcon />} />
        {publicMediations.map((mediation) => (
          <MediationCard
            key={mediation.id}
            variant="public"
            title={mediation.title}
            participants={mediation.participants}
            onPress={goToInnerMediation}
          />
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Private Mediations Section */}
        <SectionHeader title="Mediaciones Privadas" icon={<ChatIcon />} />
        {privateMediations.map((mediation) => (
          <MediationCard
            key={mediation.id}
            variant="private"
            title={mediation.message}
            unreadCount={mediation.unreadCount}
            conversation={mediation.conversation}
            onPress={goToInnerMediation}
          />
        ))}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={goToInnerMediation}>
          <Text style={styles.actionButtonText}>Levantar Mediación</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginVertical: 20,
    alignSelf: 'center',
    minWidth: 200,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    fontSize: 20,
  },
});

export default MediationScreen;
