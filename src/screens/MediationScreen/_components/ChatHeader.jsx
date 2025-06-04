import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../../../styles/commonStyles';

/**
 * ChatHeader Component
 * Displays the chat header with back button and discussion title
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The discussion title
 * @returns {JSX.Element}
 */
const ChatHeader = ({ title = "Discussion de UserFullName" }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.rowCenter,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    ...commonStyles.titleText,
    fontWeight: 'bold',
    flex: 1,
  },
});

export default ChatHeader;
