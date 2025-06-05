import React, { act, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors, spacing } from '../styles/commonStyles';

/**
 * NavigationBar Component
 * This component renders the main navigation bar for the application.
 * It displays tabs for different screens and handles navigation between them.
 *
 * @function NavigationBar
 * @returns {JSX.Element}
 */

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const navigation = useNavigation();

  const tabs = [
    { name: 'Today', icon: '🏠', screen: 'HomeScreen' },
    { name: 'Calendar', icon: '📅', screen: 'CalendarScreen' },
    { name: 'Focus', icon: 'ඞ', isCentral: true, screen: 'PublishScreen' },
    { name: 'Data', icon: '📈', screen: 'MediationScreen' },
    { name: 'Settings', icon: '⚙️', screen: 'ProfileScreen' },
  ];

  const handlePress = (ScreenButton) => {
    setActiveTab(ScreenButton.name);
    navigation.navigate(ScreenButton.screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {tabs.map((ScreenButton) => (
        // Render each ScreenButton as a TouchableOpacity
        <TouchableOpacity key={ScreenButton.name}
          style={[
            styles.tabItem, 
            ScreenButton.isCentral && styles.centralTabItem,
            activeTab === ScreenButton.name && !ScreenButton.isCentral && styles.activeTab,
          ]}
          onPress={() => handlePress(ScreenButton)}
          >

          {/* Render the icon inside a container with conditional styles */}
          <View style={[
            styles.iconContainer,
            ScreenButton.isCentral && styles.centralIconContainer,
          ]}>
            <Text style={[styles.icon, ScreenButton.isCentral && styles.centralIcon]}>{ScreenButton.icon}</Text>
          </View>

          {/* Conditionally render the label based on whether the ScreenButton is central (publish button) or not */}
          {!ScreenButton.isCentral && <Text style={styles.tabLabel}>{ScreenButton.name}</Text>}
          {ScreenButton.isCentral && <Text style={styles.centralLabel}>{ScreenButton.name}</Text>}
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.navigationContainer,
    ...commonStyles.shadowSmall,
    shadowOffset: {
      width: 0,
      height: -2,
    },
  },  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  centralTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.2,
    position: 'relative',
    bottom: spacing.lg,
  },
  iconContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerSmall,
  },
  activeIconContainer: {
    ...commonStyles.activeBackground,
  },
  centralIconContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerLarge,
    ...commonStyles.shadowMedium,
  },
  icon: {
    ...commonStyles.iconMedium,
  },
  centralIcon: {
    ...commonStyles.iconLarge,
    color: colors.semanticYellow,
  },  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  centralLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  activeTab: {
    ...commonStyles.activeBackground,
  },
  
});

export default NavigationBar;
