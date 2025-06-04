import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles, { colors, spacing } from '../styles/commonStyles';

const PostItem = ({ author, date, tags, content }) => {
  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <Text style={[commonStyles.smallText, commonStyles.boldText]}>{author}</Text>
        {/* Add author avatar/icon if needed */}
        <Text style={commonStyles.smallText}>{date}</Text>
      </View>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={commonStyles.tag}>
            <Text style={commonStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={commonStyles.bodyText}>{content}</Text>
      {/* Add post image/actions if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Additional styles if needed
    marginVertical: spacing.sm, // Adjust margin for list view
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
});

export default PostItem; 