import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import SearchComponent from './_components/SearchComponent';

/**
 * SearchScreen Component
 * This component serves as a placeholder for the Search screen in the app.
 * 
 * @function SearchScreen
 * @returns {JSX.Element}
 */
const SearchScreen = () => {
  const { styles } = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <SearchComponent />
    </View>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default SearchScreen;
