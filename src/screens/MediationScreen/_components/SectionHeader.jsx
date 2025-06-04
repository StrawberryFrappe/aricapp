import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * SectionHeader Component
 * Displays a section header with title and icon
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The section title
 * @param {React.Component} props.icon - Icon component to display
 * @returns {JSX.Element}
 */
const SectionHeader = ({ title = '', icon }) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.rowCenter,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    ...commonStyles.titleText,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default SectionHeader;
