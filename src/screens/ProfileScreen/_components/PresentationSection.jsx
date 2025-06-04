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
    backgroundColor: commonStyles.card.backgroundColor, // Use card background
    margin: spacing.md, // Use card margin
    borderRadius: commonStyles.card.borderRadius, // Use card border radius
    ...commonStyles.shadowSmall, // Use a shadow
  },
  title: {
    marginBottom: spacing.sm,
  }
});

export default PresentationSection; 