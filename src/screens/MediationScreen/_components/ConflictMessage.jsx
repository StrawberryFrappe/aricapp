import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * ConflictMessage Component
 * Displays the main conflict description message
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The conflict title
 * @param {string} props.description - The conflict description
 * @returns {JSX.Element}
 */
const ConflictMessage = ({ 
  title = "Conflicto con el vecino de al lado:", 
  description = "no me trato muy bien y me sintió mal :c" 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    ...commonStyles.bodyText,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

export default ConflictMessage;
