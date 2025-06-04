import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const EmergencyButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.buttonText}>Declarar Emergencia</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B71C1C',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadowMedium,
  },
  icon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmergencyButton;
