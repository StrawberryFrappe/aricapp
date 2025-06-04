import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import SearchComponent from './_components/SearchComponent';

/**
 * SearchScreen Component
 * This component serves as a placeholder for the Search screen in the app.
 * 
 * @function SearchScreen
 * @returns {JSX.Element}
 */
const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <SearchComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default SearchScreen;
