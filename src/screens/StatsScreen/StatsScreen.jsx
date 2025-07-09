import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const StatsScreen = () => {
  const { styles, colors } = useThemedStyles();
  
  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titleText, { marginBottom: 20 }]}>Statistics</Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default StatsScreen;
