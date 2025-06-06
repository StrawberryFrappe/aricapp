import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const StatsScreen = () => {
  const navigation = useNavigation();
  const { styles, colors } = useThemedStyles();
  
  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titleText, { marginBottom: 20 }]}>Statistics</Text>
      <TouchableOpacity 
        style={[styles.card, localStyles.navigateButton]}
        onPress={() => navigation.navigate('InnerStatsScreen')}
      >
        <Text style={styles.bodyText}>View Detailed Stats</Text>
      </TouchableOpacity>
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
  navigateButton: {
    padding: 16,
    alignItems: 'center',
  },
});

export default StatsScreen;
