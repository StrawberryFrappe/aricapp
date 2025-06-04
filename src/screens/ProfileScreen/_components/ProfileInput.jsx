import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import commonStyles, { colors, spacing, borderRadius } from '../../../styles/commonStyles';

const ProfileInput = ({ label, value, onEditPress, isEditable = false, multiline = false, onChangeText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[commonStyles.smallText, commonStyles.boldText]}>{label}</Text>
        <TouchableOpacity onPress={onEditPress}>
          <Text style={[commonStyles.smallText, styles.editText]}>{isEditable ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>
      {isEditable ? (
        <TextInput
          style={[styles.input, multiline ? styles.multilineInput : styles.singleLineInput]}
          value={value}
          onChangeText={onChangeText}
          editable={isEditable}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      ) : (
        <View style={styles.valueContainer}>
          <Text style={commonStyles.bodyText}>{value}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  editText: {
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
  },
  singleLineInput: {
    minHeight: 40, // Ensure consistent height for single line
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  valueContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.sm,
    justifyContent: 'center',
    minHeight: 40, // Match input height
  }
});

export default ProfileInput; 