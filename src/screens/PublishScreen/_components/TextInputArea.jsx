import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const TextInputArea = ({ value, onChangeText, placeholder }) => {
  const maxLength = 200;
  
  const handleTextChange = (text) => {
    if (text.length <= maxLength) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder || "Cuerpo del texto..."}
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
      />
      <Text style={styles.characterCount}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15
  },  textInput: {
    minHeight: 72, // Approximately 3 lines (24px line height * 3)
    maxHeight: 120, // Maximum height to prevent excessive growth
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  characterCount: {
    ...commonStyles.smallText,
    textAlign: 'right',
    marginTop: 5,
    color: colors.textSecondary,
  },
});

export default TextInputArea;
