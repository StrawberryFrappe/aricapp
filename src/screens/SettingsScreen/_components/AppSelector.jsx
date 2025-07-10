import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { commonStyles } from '../../../styles/commonStyles';
import AppBlocking from '../../../services/AppBlocking';

const AppSelector = ({ onSelectionChanged }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(commonStyles);
  
  // Add state for selected apps count
  const [selectedCount, setSelectedCount] = useState(0);

  // Dynamic styles based on current theme
  const localStyles = {
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      fontSize: 16,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    selectionInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    debugButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    appsList: {
      flex: 1,
    },
    appItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    appInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    appIcon: {
      width: 32,
      height: 32,
      borderRadius: 6,
      marginRight: 12,
    },
    appDetails: {
      flex: 1,
    },
    appName: {
      fontWeight: '600',
      marginBottom: 2,
      color: colors.textPrimary,
    },
    packageName: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: colors.borderLight,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    checkmark: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  };
  
  const [installedApps, setInstalledApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInstalledApps();
    loadSelectedApps();
  }, []);

  const loadInstalledApps = async () => {
    try {
      setLoading(true);
      const apps = await AppBlocking.getInstalledApps();
      console.log(`Loaded ${apps.length} apps from native module`);
      
      // Filter out any invalid apps
      const validApps = apps.filter(app => app && app.packageName && app.appName);
      if (validApps.length !== apps.length) {
        console.warn(`Filtered out ${apps.length - validApps.length} invalid apps`);
      }
      
      setInstalledApps(validApps);
    } catch (error) {
      console.error('Error loading apps:', error);
      Alert.alert('Error', 'Failed to load installed apps. Please try again.');
      setInstalledApps([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedApps = async () => {
    try {
      const selected = await AppBlocking.getSelectedApps();
      const selectedSet = new Set(selected);
      setSelectedApps(selectedSet);
      setSelectedCount(selectedSet.size);
    } catch (error) {
      console.error('Error loading selected apps:', error);
    }
  };

  const toggleAppSelection = (packageName) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(packageName)) {
      newSelected.delete(packageName);
    } else {
      newSelected.add(packageName);
    }
    setSelectedApps(newSelected);
    setSelectedCount(newSelected.size);
    onSelectionChanged && onSelectionChanged(newSelected); // Notify parent component
  };

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return installedApps.filter(app => app && app.packageName); // Filter out invalid apps
    }
    
    return installedApps.filter(app => {
      if (!app || !app.packageName || !app.appName) return false; // Safety check
      return app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [installedApps, searchQuery]);

  const saveSelections = async () => {
    try {
      setSaving(true);
      const selectedArray = Array.from(selectedApps);
      await AppBlocking.saveSelectedApps(selectedArray);
      
      // Notify parent component of the change
      if (onSelectionChanged) {
        onSelectionChanged(selectedArray.length);
      }
      
      if (selectedArray.length === 0) {
        Alert.alert(
          'No Apps Selected', 
          'You haven\'t selected any apps for blocking. App blocking during calendar events will not work until you select at least one app.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Success', 
          `App blocking preferences saved! ${selectedArray.length} app${selectedArray.length === 1 ? '' : 's'} will be blocked during focus sessions.`
        );
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      Alert.alert('Error', 'Failed to save selections. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const searchPopularApps = async () => {
    try {
      const searchTerms = ['YouTube', 'Instagram', 'Discord', 'Facebook', 'Twitter'];
      let allResults = [];
      
      for (const term of searchTerms) {
        const results = await AppBlocking.findAppsByName(term);
        allResults.push({ searchTerm: term, results });
      }
      
      console.log('App search results:', allResults);
      
      let message = 'App Search Results:\n\n';
      allResults.forEach(({ searchTerm, results }) => {
        message += `Search: "${searchTerm}"\n`;
        if (!results || results.length === 0) {
          message += '  No matches found\n\n';
        } else {
          results.forEach(app => {
            if (app && app.packageName) {
              message += `  ${app.appName || 'Unknown'}\n`;
              message += `  Package: ${app.packageName}\n`;
              message += `  Launchable: ${app.hasLaunchIntent}\n`;
              message += `  System: ${app.isSystemApp}\n`;
              message += `  Filtered: ${app.wouldBeFiltered}\n\n`;
            }
          });
        }
      });
      
      Alert.alert('App Search Results', message);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', error.message);
    }
  };

  const debugPopularApps = async () => {
    try {
      const debugInfo = await AppBlocking.checkPopularApps();
      console.log('Popular apps debug info:', debugInfo);
      
      let message = 'Popular Apps Status:\n\n';
      debugInfo.forEach(app => {
        if (app && app.packageName) {
          message += `${app.appName || 'Unknown'} (${app.packageName})\n`;
          message += `  Installed: ${app.isInstalled}\n`;
          if (app.isInstalled) {
            message += `  Has Launch Intent: ${app.hasLaunchIntent}\n`;
            message += `  Is System App: ${app.isSystemApp}\n`;
            message += `  Would Be Filtered: ${app.wouldBeFiltered}\n`;
          }
          message += '\n';
        }
      });
      
      Alert.alert('Debug Info', message);
    } catch (error) {
      console.error('Debug error:', error);
      Alert.alert('Debug Error', error.message);
    }
  };

  const renderAppItem = useCallback(({ item }) => {
    // Add safety check for undefined items
    if (!item || !item.packageName) {
      console.warn('Skipping undefined app item:', item);
      return null;
    }
    
    const isSelected = selectedApps.has(item.packageName);
    
    return (
      <TouchableOpacity
        style={[
          localStyles.appItem,
          { 
            borderColor: colors.borderLight,
            backgroundColor: isSelected ? colors.surfaceLight : colors.surface,
          }
        ]}
        onPress={() => toggleAppSelection(item.packageName)}
      >
        <View style={localStyles.appInfo}>
          {item.icon ? (
            <Image
              source={{ uri: `data:image/png;base64,${item.icon}` }}
              style={localStyles.appIcon}
            />
          ) : (
            <View style={[localStyles.appIcon, { backgroundColor: colors.borderLight }]} />
          )}
          
          <View style={localStyles.appDetails}>
            <Text style={[styles.bodyText, localStyles.appName]} numberOfLines={1}>
              {item.appName}
            </Text>
            <Text style={[styles.smallText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.packageName}
            </Text>
          </View>
        </View>

        <View style={[
          localStyles.checkbox,
          { 
            borderColor: colors.primary,
            backgroundColor: isSelected ? colors.primary : 'transparent',
          }
        ]}>
          {isSelected && (
            <Text style={[localStyles.checkmark, { color: colors.textOnPrimary || '#fff' }]}>
              ✓
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [selectedApps, colors, styles, toggleAppSelection]);

  const getItemLayout = useCallback((data, index) => ({
    length: 64, // Approximate height of each item
    offset: 64 * index,
    index,
  }), []);

  const keyExtractor = useCallback((item) => item.packageName, []);

  useEffect(() => {
    setSelectedCount(selectedApps.size);
  }, [selectedApps]);

  if (loading) {
    return (
      <View style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.bodyText, { marginTop: 16, color: colors.textSecondary }]}>
          Loading installed apps...
        </Text>
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <Text style={[styles.subtitle, { marginBottom: 12 }]}>
        Select Apps to Block
      </Text>
      
      <Text style={[styles.smallText, { color: colors.textSecondary, marginBottom: 16 }]}>
        Choose which apps should be blocked during focus sessions. System apps and your main productivity apps are filtered out.
      </Text>

      <TextInput
        style={[
          localStyles.searchInput,
          { 
            borderColor: colors.borderLight,
            backgroundColor: colors.surface,
            color: colors.text,
          }
        ]}
        placeholder="Search apps..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={localStyles.selectionInfo}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.smallText, { color: colors.textSecondary }]}>
            {selectedApps.size} apps selected • {filteredApps.length} apps shown
          </Text>
          {selectedApps.size === 0 && (
            <Text style={[styles.smallText, { color: colors.error || '#FF6B6B', marginTop: 4 }]}>
              ⚠️ No apps selected - blocking will not work during events
            </Text>
          )}
        </View>
        
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity
            style={[
              localStyles.saveButton,
              { 
                backgroundColor: colors.primary,
                opacity: saving ? 0.6 : 1,
              }
            ]}
            onPress={saveSelections}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary || '#fff'} />
            ) : (
              <Text style={[styles.smallText, { color: colors.textOnPrimary || '#fff', fontWeight: '600' }]}>
                Save ({selectedApps.size})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredApps}
        renderItem={renderAppItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        style={localStyles.appsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AppSelector;
