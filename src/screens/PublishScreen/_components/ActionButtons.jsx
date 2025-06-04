import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const ActionButtons = ({ onPhotoPress, onPublishPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.photoButton} onPress={onPhotoPress}>
        <Text style={styles.photoIcon}>📷</Text>
        <Text style={styles.photoButtonText}>Foto</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.publishButton} onPress={onPublishPress}>
        <Text style={styles.publishButtonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({  container: {
    ...commonStyles.rowCenter,
    ...commonStyles.spaceBetween,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
  },photoButton: {
    ...commonStyles.rowCenter,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  photoIcon: {
    fontSize: 16,
    marginRight: 8,
  },  photoButtonText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
  publishButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  publishButtonText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
});

export default ActionButtons;
