import React, { act, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { spacing } from '../styles/commonStyles';

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
  const { styles: themeStyles, colors } = useThemedStyles();
  const navStyles = StyleSheet.create({
    container: { ...themeStyles.navigationContainer, ...themeStyles.shadowSmall, shadowOffset: { width: 0, height: -2 } },
    tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: spacing.sm },
    centralTabItem: { alignItems: 'center', justifyContent: 'center', flex: 1.2, position: 'relative', bottom: spacing.lg },
    iconContainer: { ...themeStyles.iconContainer, ...themeStyles.iconContainerSmall },
    centralIconContainer: { ...themeStyles.iconContainer, ...themeStyles.iconContainerLarge, ...themeStyles.shadowMedium },
    icon: themeStyles.iconMedium,
    centralIcon: { ...themeStyles.iconLarge, color: colors.semanticYellow },
    tabLabel: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
    centralLabel: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.md },
    activeTab: themeStyles.activeBackground,
  });
  const tabs = [
    { name: 'Today', icon: '🏠', screen: 'HomeScreen' },
    { name: 'Calendar', icon: '📅', screen: 'CalendarScreen' },
    { name: 'Focus', icon: 'ඞ', isCentral: true, screen: 'ZenScreen' },
    { name: 'Data', icon: '📈', screen: 'StatsScreen' },
    { name: 'Settings', icon: '⚙️', screen: 'SettingsScreen' },
  ];

  const handlePress = (ScreenButton) => {
    setActiveTab(ScreenButton.name);
    navigation.navigate(ScreenButton.screen);
  };

  return (
    <SafeAreaView style={navStyles.container}>
      {tabs.map((ScreenButton) => (
        <TouchableOpacity key={ScreenButton.name}
          style={[
            navStyles.tabItem,
            ScreenButton.isCentral && navStyles.centralTabItem,
            activeTab === ScreenButton.name && !ScreenButton.isCentral && navStyles.activeTab,
          ]}
          onPress={() => handlePress(ScreenButton)}
          >

          {/* Render the icon inside a container with conditional styles */}
          <View style={[
            navStyles.iconContainer,
            ScreenButton.isCentral && navStyles.centralIconContainer,
          ]}>
            <Text style={[navStyles.icon, ScreenButton.isCentral && navStyles.centralIcon]}>
              {ScreenButton.icon}
            </Text>
          </View>

          {/* Conditionally render the label based on whether the ScreenButton is central (publish button) or not */}
          {!ScreenButton.isCentral && (
            <Text style={navStyles.tabLabel}>{ScreenButton.name}</Text>
          )}
          {ScreenButton.isCentral && (
            <Text style={navStyles.centralLabel}>{ScreenButton.name}</Text>
          )}
         </TouchableOpacity>
       ))}
    </SafeAreaView>
   );
};

export default NavigationBar;
