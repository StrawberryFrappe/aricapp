import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import TodaySchedule from './_components/TodaySchedule';
import BlockingStatusIndicator from '../../components/BlockingStatusIndicator';

/** 
 * Home Screen Component
 * This component serves as the main home screen for the productivity app.
 * It displays the daily schedule and allows navigation to task creation.
 * 
 * @function HomeScreen
 * @returns {JSX.Element}
 * */ 


const HomeScreen = () => {
  const { styles, colors } = useThemedStyles();
  
  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <View style={localStyles.statusContainer}>
        <BlockingStatusIndicator compact={true} />
      </View>
      <TodaySchedule />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
});

export default HomeScreen;
