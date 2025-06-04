import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../../../styles/commonStyles';

/**
 * SearchComponent
 * A reusable search component with search bar and category tabs
 * 
 * @function SearchComponent
 * @returns {JSX.Element}
 */
const SearchComponent = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('Personas');

  const categories = ['Personas', 'Alertas', 'Anuncios', 'Ayuda'];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Que estas buscando?"
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              activeCategory === category && styles.activeTab
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === category && styles.activeTabText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default SearchComponent;
