import React from 'react';
import { View, Text, Image } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
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
  const { styles } = useThemedStyles(createStyles);
  
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

const createStyles = (colors) => ({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 16,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagAnuncios: {
    backgroundColor: colors.tagBackground,
  },
  tagComunidad: {
    backgroundColor: colors.tagBackground,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  mainImage: {
    width: 'auto',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  }
});

export default Post;
