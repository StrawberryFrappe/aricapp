import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../../styles/commonStyles';

const UserProfile = ({ username, avatar }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={avatar ? { uri: avatar } : require('../../../assets/images/11.jpg')} 
        style={styles.avatar}
      />
      <Text style={styles.username}>{username}</Text>
      <View style={styles.onlineIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.rowCenter,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    ...commonStyles.bodyText,
    fontWeight: '600',
    flex: 1,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 5,
  },
});

export default UserProfile;
