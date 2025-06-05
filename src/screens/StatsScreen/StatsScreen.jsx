import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/commonStyles';

const StatsScreen = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default StatsScreen;
