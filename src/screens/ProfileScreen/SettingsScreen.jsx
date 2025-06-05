import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import ThemeSelector from './_components/ThemeSelector';

/**
 * SettingsScreen Component
 * This component serves as the settings screen for the app with theme selection.
 * 
 * @function SettingsScreen
 * @returns {JSX.Element}
 */

const SettingsScreen = () => {
  const { styles, colors } = useThemedStyles();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={localStyles.header}>
        <Text style={[styles.titleText, { fontSize: 24, marginBottom: 8 }]}>
          Settings
        </Text>
        <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
          Customize your app experience
        </Text>
      </View>

      <View style={[localStyles.section, { borderColor: colors.borderLight }]}>
        <Text style={[styles.titleText, { fontSize: 18, marginBottom: 16 }]}>
          Appearance
        </Text>
        <ThemeSelector />
      </View>

      {/* Space for future settings sections */}
      <View style={localStyles.spacer} />
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  spacer: {
    height: 100, // Space for navigation
  },
});

export default SettingsScreen;
