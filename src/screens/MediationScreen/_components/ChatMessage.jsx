import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * ChatMessage Component
 * Displays a chat message with user info, role, timestamp, and content
 *
 * @param {Object} props - Component props
 * @param {string} props.username - The username of the sender
 * @param {string} props.role - The role of the sender (e.g., "Vecino - Contraparte", "Mediador")
 * @param {string} props.timestamp - The timestamp when the message was sent
 * @param {string} props.message - The message content
 * @param {string} props.avatar - The avatar image source
 * @param {boolean} props.isOwn - Whether this message is from the current user
 * @param {string} props.variant - Message variant ('text' or 'image')
 * @param {string} props.imageSource - Image source for image messages
 * @returns {JSX.Element}
 */
const ChatMessage = ({ 
  username = "Username", 
  role = "Vecino", 
  timestamp = "Tú", 
  message = "", 
  avatar = null,
  isOwn = false,
  variant = 'text',
  imageSource = null
}) => {
  const renderMessageContent = () => {
    if (variant === 'image' && imageSource) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageSource }} style={styles.messageImage} />
        </View>
      );
    }
    
    if (message && message.length > 0) {
      return (
        <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageHeader}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
        
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      
      {renderMessageContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageHeader: {
    ...commonStyles.rowCenter,
    marginBottom: 8,
  },
  avatar: {
    ...commonStyles.avatarSmall,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...commonStyles.smallText,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  role: {
    ...commonStyles.smallText,
    color: colors.textSecondary,
  },
  timestamp: {
    ...commonStyles.smallText,
    color: colors.textSecondary,
  },
  messageContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: '80%',
    marginLeft: 50, // Offset for avatar space
  },
  ownMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  otherMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    ...commonStyles.bodyText,
  },
  imageContainer: {
    marginLeft: 50,
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: '70%',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});

export default ChatMessage;
