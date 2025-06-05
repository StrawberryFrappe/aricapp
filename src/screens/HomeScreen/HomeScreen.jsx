import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import TodaySchedule from './_components/TodaySchedule';

/** 
 * Home Screen Component
 * This component serves as a placeholder for the Home screen in the app.
 * It includes a button to navigate to the Calendar screen and displays a Post component.
 * 
 * @function HomeScreen
 * @returns {JSX.Element}
 * */ 


const HomeScreen = () => {
  const navigation = useNavigation();
  const { styles } = useThemedStyles(createStyles);
  
  return (
    <View style={styles.container}>
      <TodaySchedule onAdd={() => navigation.navigate('CreateTask')} />
    </View>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default HomeScreen;
