import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * ChatInput Component
 * Displays the chat input area with text input, attachment button, and send button
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Function to call when sending a message
 * @param {Function} props.onAttachmentPress - Function to call when attachment button is pressed
 * @returns {JSX.Element}
 */
const ChatInput = ({ onSendMessage, onAttachmentPress }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim().length > 0 && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleAttachment = () => {
    if (onAttachmentPress) {
      onAttachmentPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escribe un mensaje</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton} onPress={handleAttachment}>
          <Text style={styles.attachmentIcon}>📎</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder=""
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  label: {
    ...commonStyles.smallText,
    marginBottom: 8,
  },  inputContainer: {
    ...commonStyles.rowCenter,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 45,
  },
  attachmentButton: {
    marginRight: 10,
  },
  attachmentIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  textInput: {
    flex: 1,
    ...commonStyles.bodyText,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default ChatInput;
