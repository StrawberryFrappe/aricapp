/**
 * Blocking Status Indicator Component
 * 
 * Shows current app blocking status with visual indicators.
 * Displays when auto-blocking is active for calendar events.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useCalendarContext } from '../context/CalendarContext';

const BlockingStatusIndicator = ({ onPress = null, compact = false }) => {
  const { colors } = useThemedStyles();
  const { blockingStatus, manualOverrideBlocking } = useCalendarContext();

  if (!blockingStatus.autoBlockingEnabled) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (blockingStatus.isBlocking) {
      // Default action: show override option
      manualOverrideBlocking();
    }
  };

  const getStatusInfo = () => {
    if (blockingStatus.isBlocking) {
      return {
        icon: '🚫',
        text: compact ? 'Blocking' : `Blocking: ${blockingStatus.currentBlockingEvent?.title}`,
        color: '#FF6B6B',
        backgroundColor: '#FF6B6B20',
        borderColor: '#FF6B6B'
      };
    } else if (blockingStatus.isMonitoring) {
      return {
        icon: '👁️',
        text: compact ? 'Monitoring' : 'Monitoring priority events',
        color: '#4A90E2',
        backgroundColor: '#4A90E220',
        borderColor: '#4A90E2'
      };
    } else {
      return {
        icon: '⏸️',
        text: compact ? 'Inactive' : 'Auto-blocking inactive',
        color: colors.textSecondary,
        backgroundColor: colors.surface,
        borderColor: colors.borderLight
      };
    }
  };

  const statusInfo = getStatusInfo();

  const localStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: compact ? 8 : 12,
      paddingVertical: compact ? 4 : 8,
      backgroundColor: statusInfo.backgroundColor,
      borderWidth: 1,
      borderColor: statusInfo.borderColor,
      borderRadius: compact ? 12 : 8,
      marginHorizontal: compact ? 4 : 0,
    },
    icon: {
      fontSize: compact ? 12 : 14,
      marginRight: compact ? 4 : 6,
    },
    text: {
      fontSize: compact ? 10 : 12,
      color: statusInfo.color,
      fontWeight: compact ? 'normal' : 'bold',
      flex: 1,
    },
    pulse: {
      // Animation effect for active blocking
      opacity: blockingStatus.isBlocking ? 0.8 : 1,
    },
  });

  if (compact) {
    return (
      <TouchableOpacity 
        style={[localStyles.container, localStyles.pulse]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={localStyles.icon}>{statusInfo.icon}</Text>
        <Text style={localStyles.text} numberOfLines={1}>
          {statusInfo.text}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[localStyles.container, localStyles.pulse]}>
      <Text style={localStyles.icon}>{statusInfo.icon}</Text>
      <Text style={localStyles.text} numberOfLines={1}>
        {statusInfo.text}
      </Text>
      {blockingStatus.isBlocking && (
        <TouchableOpacity 
          onPress={handlePress}
          style={{
            backgroundColor: statusInfo.color,
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            Stop
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BlockingStatusIndicator;
