import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { commonStyles, colors, spacing } from '../styles/commonStyles';

/**
 * UserTag Component
 * This component displays a user's profile picture, username, and date in a styled header format.
 * It currently uses a static image and username but can be extended to accept props for dynamic data.
 * 
 * @function UserTag
 * @returns {JSX.Element}
 */

const UserTag = () => {
  return (
    <View style={styles.header}>
        <Image source={require('../assets/images/11.jpg')} style={styles.avatar} />
        <View style={styles.headerTextContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>TulioTriviño31</Text>
            <Text style={styles.icon}>🏠</Text> 
            <Text style={styles.icon}>✔️</Text>
          </View>
          <Text style={styles.date}>06-04-2025</Text>
        </View>
      </View>
  );
};
const styles = StyleSheet.create({
  header: {
    ...commonStyles.rowCenter,
    marginBottom: spacing.md,
  },
  avatar: {
    ...commonStyles.avatarSmall,
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  userNameContainer: {
    ...commonStyles.rowCenter,
  },
  userName: {
    ...commonStyles.boldText,
    fontSize: 16,
  },
  icon: {
    ...commonStyles.iconSmall,
    marginLeft: spacing.sm,
  },
  date: {
    ...commonStyles.smallText,
  },
});

export default UserTag;

