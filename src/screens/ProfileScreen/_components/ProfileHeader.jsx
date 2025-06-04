import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import commonStyles, { colors, spacing } from '../../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';


const ProfileHeader = ({ avatarUrl, name, publications, likes }) => {
    const navigation = useNavigation();

    const handleSettingsPress = () => {
        navigation.navigate('EditProfileScreen');
    }
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={require('../../../assets/images/11.jpg')} style={commonStyles.avatarBig} />
      </View>
      <View style={styles.userInfo}>
        <Text style={[commonStyles.titleText, commonStyles.boldText]}>{name}</Text>
        {/* Add icons for home/star if needed later */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={commonStyles.smallText}>Publicaciones </Text>
            <Text style={[commonStyles.smallText, commonStyles.boldText]}>{publications}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={commonStyles.smallText}>Likes </Text>
            <Text style={[commonStyles.smallText, commonStyles.boldText]}>{likes}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.settingsIcon} onPress={handleSettingsPress}>
        <Text style={commonStyles.iconLarge}>...</Text>
      </TouchableOpacity>
      {/* Add settings icon if needed later */}
    </View>
  );
};

const styles = StyleSheet.create({  container: {
    flexDirection: 'row',
    alignItems: 'top',
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    marginRight: spacing.lg,
  },
  settingsIcon: {
    paddingTop: spacing.md,
  },
});

export default ProfileHeader;
