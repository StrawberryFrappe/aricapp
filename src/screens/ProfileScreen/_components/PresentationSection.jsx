import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles, { spacing } from '../../../styles/commonStyles';

const PresentationSection = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={[commonStyles.boldText, commonStyles.bodyText, styles.title]}>Presentacion</Text>
      <Text style={commonStyles.bodyText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: commonStyles.card.backgroundColor, // Use card background
    ...commonStyles.shadowSmall, // Use a shadow
  },
  title: {
    marginBottom: spacing.sm,
  },
  bodyText: {
  },
});

export default PresentationSection; 