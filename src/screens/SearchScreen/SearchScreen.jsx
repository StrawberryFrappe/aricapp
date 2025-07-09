import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  const { colors } = useThemedStyles();
  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <SearchComponent />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchScreen;
