import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../styles/commonStyles';
import MyWeek from './_components/MyWeek';
import Post from '../../components/Post';

/** 
 * Home Screen Component
 * This component serves as a placeholder for the Home screen in the app.
 * It includes a button to navigate to the Calendar screen and displays a Post component.
 * 
 * @function HomeScreen
 * @returns {JSX.Element}
 * */ 


const HomeScreen = () => {
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
      <MyWeek />
      <Post></Post>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centeredContainer,
  },
  text: {
    ...commonStyles.titleText,
  },
});

export default HomeScreen;
