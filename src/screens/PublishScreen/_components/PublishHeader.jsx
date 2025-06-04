import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const PublishHeader = ({ onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Crear una Publicacion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...commonStyles.rowCenter,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...commonStyles.titleText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PublishHeader;
