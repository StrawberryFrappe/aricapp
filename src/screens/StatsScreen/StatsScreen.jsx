import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../../styles/commonStyles';
import SectionHeader from './_components/SectionHeader';
import MediationCard from './_components/MediationCard';


/**
 * StatsScreen Component
 * This component displays the user's statistics, both public and private data.
 * It shows a list of public statistics and private metrics, with navigation
 * to specific statistic details.
 *
 * @function StatsScreen
 * @returns {JSX.Element}
 */

const StatsScreen = () => {
  const navigation = useNavigation();

  // Sample data for statistics
  const publicStats = [
    { id: 1, title: 'Tareas Completadas', participants: 12 },
    { id: 2, title: 'Eventos Asistidos', participants: 8 },
  ];

  const privateStats = [
    { id: 1, message: 'Métricas Personales', unreadCount: 3, conversation: 'stats' },
    { id: 2, message: 'Progreso Semanal', unreadCount: 1, conversation: 'progress' },
  ];

  const goToInnerStats = () => {
    navigation.navigate('InnerStatsScreen');
  };

  const UsersIcon = () => <Text style={styles.icon}>👥</Text>;
  const ChatIcon = () => <Text style={styles.icon}>📊</Text>;
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tus Estadísticas</Text>
        </View>

        {/* Public Statistics Section */}
        <SectionHeader title="Estadísticas Públicas" icon={<UsersIcon />} />
        {publicStats.map((stat) => (
          <MediationCard
            key={stat.id}
            variant="public"
            title={stat.title}
            participants={stat.participants}
            onPress={goToInnerStats}
          />
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Private Statistics Section */}
        <SectionHeader title="Estadísticas Privadas" icon={<ChatIcon />} />
        {privateStats.map((stat) => (
          <MediationCard
            key={stat.id}
            variant="private"
            title={stat.message}
            unreadCount={stat.unreadCount}
            conversation={stat.conversation}
            onPress={goToInnerStats}
          />
        ))}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={goToInnerStats}>
          <Text style={styles.actionButtonText}>Ver Estadísticas Detalladas</Text>
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

export default StatsScreen;
