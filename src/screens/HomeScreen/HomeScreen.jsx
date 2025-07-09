import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import TodaySchedule from './_components/TodaySchedule';

/** 
 * Home Screen Component
 * This component serves as the main home screen for the productivity app.
 * It displays the daily schedule and allows navigation to task creation.
 * 
 * @function HomeScreen
 * @returns {JSX.Element}
 * */ 


const HomeScreen = () => {
  const navigation = useNavigation();
  const { styles, colors } = useThemedStyles();
  
  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <TodaySchedule onAdd={() => navigation.navigate('CreateTask')} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
