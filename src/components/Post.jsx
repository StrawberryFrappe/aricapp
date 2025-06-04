import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { commonStyles, colors, spacing, borderRadius } from '../styles/commonStyles';
import UserTag from './UserTag';


/**
 * Post Component
 * This component represents a single post in the application.
 * It includes a user tag, tags for the post, post text, an image, and a footer with interaction options.
 * Currently, it uses static data for demonstration purposes.
 *
 * @function Post
 * @returns {JSX.Element}
 */

const Post = () => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <UserTag />

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <View style={[styles.tag, styles.tagAnuncios]}>
          <Text style={styles.tagText}>Anuncios</Text>
        </View>
        <View style={[styles.tag, styles.tagComunidad]}>
          <Text style={styles.tagText}>Comunidad</Text>
        </View>
      </View>

      {/* Post Text */}
      <Text style={styles.postText}>
        Vecinos, hoy se inauguro el nuevo Parque Cacique Lienan Llanquinao, aca los ninos de la población podrán jugar libremente y los adultos mayores pasear en la tranquilidad del vecindario
      </Text>

      {/* Image */}
      <Image source={require('../assets/images/11.jpg')} style={styles.mainImage} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.icon}>👍</Text>
          <Text style={styles.footerText}>100</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.icon}>💬</Text>
          <Text style={styles.footerText}>14</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
  },
  icon: {
    ...commonStyles.iconSmall,
    marginLeft: spacing.sm,
  },
  tagsContainer: {
    ...commonStyles.row,
    marginBottom: spacing.md,
  },
  tag: {
    ...commonStyles.tag,
  },
  tagAnuncios: {
    backgroundColor: colors.tagBackground,
  },
  tagComunidad: {
    backgroundColor: colors.tagBackground,
  },
  tagText: {
    ...commonStyles.tagText,
  },
  postText: {
    ...commonStyles.bodyText,
    marginBottom: spacing.md,
  },
  mainImage: {
    width: 'auto',
    height: 200,
    borderRadius: borderRadius.small,
    marginBottom: spacing.md,
    resizeMode: 'contain',
  },
  footer: {
    ...commonStyles.rowCenter,
    ...commonStyles.topBorder,
    paddingTop: spacing.md,
  },
  footerItem: {
    ...commonStyles.rowCenter,
    marginRight: spacing.xl,
  },
  footerText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
  }
});

export default Post;
