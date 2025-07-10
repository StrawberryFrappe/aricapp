import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import ThemeSelector from './_components/ThemeSelector';
import AppSelector from './_components/AppSelector';
import AutoBlockingSettings from './_components/AutoBlockingSettings';
import AppBlocking from '../../services/AppBlocking';

/**
 * SettingsScreen Component
 * This component serves as the settings screen for the app with theme selection.
 *
 * @function SettingsScreen
 * @returns {JSX.Element}
 */
const SettingsScreen = () => {
  const { styles, colors } = useThemedStyles();
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedAppsCount, setSelectedAppsCount] = useState(0);

  useEffect(() => {
    loadSelectedAppsCount();
  }, []);

  const loadSelectedAppsCount = async () => {
    try {
      const selectedApps = await AppBlocking.getSelectedApps();
      setSelectedAppsCount(selectedApps ? selectedApps.length : 0);
    } catch (error) {
      console.error('Error loading selected apps count:', error);
      setSelectedAppsCount(0);
    }
  };

  const settingsData = [
    {
      id: 'header',
      type: 'header',
    },
    {
      id: 'auto-blocking',
      type: 'section',
      title: 'Auto-Blocking',
      subtitle: 'Automatic blocking during calendar events',
      component: 'auto-blocking',
    },
    {
      id: 'app-blocking',
      type: 'section',
      title: 'App Selection',
      subtitle: selectedAppsCount === 0 
        ? '⚠️ No apps selected - blocking will not work' 
        : `${selectedAppsCount} app${selectedAppsCount === 1 ? '' : 's'} selected for blocking`,
      component: 'app-selector',
    },
    {
      id: 'appearance',
      type: 'section',
      title: 'Appearance',
      subtitle: 'Theme and visual preferences',
      component: 'theme',
    },
    {
      id: 'spacer',
      type: 'spacer',
    },
  ];

  const toggleSection = (sectionId) => {
    const newExpandedSection = expandedSection === sectionId ? null : sectionId;
    setExpandedSection(newExpandedSection);
    
    // Refresh count when app-blocking section is collapsed (potentially after saving)
    if (expandedSection === 'app-blocking' && newExpandedSection !== 'app-blocking') {
      loadSelectedAppsCount();
    }
  };

  const renderSettingsItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={localStyles.header}>
            <Text style={[styles.titleText, { fontSize: 24, marginBottom: 8 }]}>
              Settings
            </Text>
            <Text style={styles.bodyText}>
              Customize your app experience
            </Text>
          </View>
        );
      
      case 'section':
        const isExpanded = expandedSection === item.id;
        return (
          <View style={[localStyles.sectionContainer, { borderColor: colors.borderLight }]}>
            <TouchableOpacity
              style={[localStyles.sectionHeader, { backgroundColor: colors.surface }]}
              onPress={() => toggleSection(item.id)}
              activeOpacity={0.7}
            >
              <View style={localStyles.sectionHeaderContent}>
                <View style={localStyles.sectionTitleContainer}>
                  <Text style={[styles.titleText, { fontSize: 18 }]}>
                    {item.title}
                  </Text>
                  <Text style={[
                    styles.smallText, 
                    { 
                      marginTop: 2,
                      color: item.id === 'app-blocking' && selectedAppsCount === 0 
                        ? colors.error || '#FF6B6B' 
                        : colors.textSecondary
                    }
                  ]}>
                    {item.subtitle}
                  </Text>
                </View>
                <View style={localStyles.chevron}>
                  <Text style={[localStyles.chevronText, { 
                    color: colors.textSecondary,
                    transform: [{ rotate: isExpanded ? '90deg' : '0deg' }]
                  }]}>
                    ›
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={localStyles.sectionContent}>
                {item.component === 'theme' && <ThemeSelector />}
                {item.component === 'app-selector' && (
                  <AppSelector onSelectionChanged={(count) => setSelectedAppsCount(count)} />
                )}
                {item.component === 'auto-blocking' && <AutoBlockingSettings />}
              </View>
            )}
          </View>
        );
      
      case 'spacer':
        return <View style={localStyles.spacer} />;
      
      default:
        return null;
    }
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={settingsData}
      renderItem={renderSettingsItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    backgroundColor: 'transparent',
  },
  spacer: {
    height: 100, // Space for navigation
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderTopWidth: 1,
    paddingTop: 16,
  },
});

export default SettingsScreen;
