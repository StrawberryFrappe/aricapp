import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import  { commonStyles, colors, spacing } from '../../../styles/commonStyles';

const ProfileTabs = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
          onPress={() => handleTabPress(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  tabItem: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default ProfileTabs; 