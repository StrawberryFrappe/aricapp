import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * MediationCard Component
 * Displays either a public mediation card or a private mediation message
 * based on the variant prop
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - 'public' or 'private' to determine the style and content
 * @param {string} props.title - The mediation title (for public) or message (for private)
 * @param {number} props.participants - Number of participants (for public variant)
 * @param {number} props.unreadCount - Number of unread messages (for private variant)
 * @param {string} props.conversation - Conversation details (for private variant)
 * @param {Function} props.onPress - Function to call when card is pressed
 * @returns {JSX.Element}
 */
const MediationCard = ({ variant = 'public', title = '', participants, unreadCount, conversation = '', onPress }) => {
  const isPrivate = variant === 'private';
  
  // Render functions for cleaner conditional logic
  const renderUnreadCount = () => {
    if (isPrivate && unreadCount > 0) {
      return <Text style={styles.unreadCount}>{unreadCount} mensajes sin leer</Text>;
    }
    return null;
  };

  const renderTitle = () => {
    if (title && title.length > 0) {
      return <Text style={styles.title}>{title}</Text>;
    }
    return null;
  };

  const renderParticipants = () => {
    if (!isPrivate && participants > 0) {
      return <Text style={styles.participants}>{participants} participantes</Text>;
    }
    return null;
  };

  const renderConversation = () => {
    if (isPrivate && conversation && conversation.length > 0) {
      return <Text style={styles.conversation}>{conversation}</Text>;
    }
    return null;
  };
  
  return (
    <TouchableOpacity style={[styles.card, isPrivate ? styles.privateCard : styles.publicCard]} onPress={onPress}>
      {renderUnreadCount()}
      {renderTitle()}
      {renderParticipants()}
      {renderConversation()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({  card: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  publicCard: {
    backgroundColor: colors.semanticBlue, // Tech blue background for public mediations
  },
  privateCard: {
    backgroundColor: colors.semanticPurple, // Tech orange background for private mediations
  },
  title: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  participants: {
    ...commonStyles.smallText,
    color: colors.textSecondary,
  },
  unreadCount: {
    ...commonStyles.smallText,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  conversation: {
    ...commonStyles.smallText,
    color: colors.textSecondary,
  },
});

export default MediationCard;
