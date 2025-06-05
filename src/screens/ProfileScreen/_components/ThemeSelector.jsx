import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

/**
 * ThemeSelector Component
 * Displays available themes with preview colors and allows theme selection
 */
const ThemeSelector = () => {
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const { styles, colors } = useThemedStyles();

  const renderThemeOption = (themeKey, theme) => (
    <TouchableOpacity
      key={themeKey}
      style={[
        localStyles.themeOption,
        { borderColor: colors.borderDefault },
        currentTheme === themeKey && { 
          borderColor: colors.primary,
          backgroundColor: colors.surfaceLight 
        }
      ]}
      onPress={() => changeTheme(themeKey)}
    >
      <View style={localStyles.themePreview}>
        <View style={[
          localStyles.colorSwatch,
          { backgroundColor: theme.colors.primary }
        ]} />
        <View style={[
          localStyles.colorSwatch,
          { backgroundColor: theme.colors.secondary }
        ]} />
        <View style={[
          localStyles.colorSwatch,
          { backgroundColor: theme.colors.accent }
        ]} />
      </View>
      
      <Text style={[styles.bodyText, { marginTop: 8 }]}>
        {theme.name}
      </Text>
      
      {currentTheme === themeKey && (
        <View style={[localStyles.selectedIndicator, { backgroundColor: colors.primary }]}>
          <Text style={[styles.smallText, { color: colors.white }]}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={localStyles.container}>
      <Text style={[styles.titleText, { marginBottom: 16 }]}>
        Choose Theme
      </Text>
      
      <View style={localStyles.themesGrid}>
        {Object.entries(availableThemes).map(([key, theme]) =>
          renderThemeOption(key, theme)
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeOption: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 4,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeSelector;
