import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const AddTagButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Añadir etiqueta</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddTagButton;
