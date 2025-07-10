/**
 * Auto Blocking Settings Component
 * 
 * Provides settings interface for event-based auto-blocking functionality.
 * Allows users to enable/disable auto-blocking for priority events and
 * view current blocking status.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useCalendarContext } from '../../../context/CalendarContext';
import AppBlocking from '../../../services/AppBlocking';

const AutoBlockingSettings = () => {
  const { styles, colors } = useThemedStyles();
  const { 
    blockingStatus, 
    toggleAutoBlocking, 
    manualOverrideBlocking,
    getUpcomingPriorityEvents 
  } = useCalendarContext();

  const [hasAccessibilityPermission, setHasAccessibilityPermission] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    checkPermissions();
    loadUpcomingEvents();
  }, []);

  useEffect(() => {
    loadUpcomingEvents();
  }, [blockingStatus]);

  const checkPermissions = async () => {
    try {
      const hasAccessibility = await AppBlocking.isAccessibilityEnabled();
      setHasAccessibilityPermission(hasAccessibility);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const loadUpcomingEvents = () => {
    const upcoming = getUpcomingPriorityEvents().slice(0, 3); // Show next 3 events
    setUpcomingEvents(upcoming);
  };

  const handleToggleAutoBlocking = async (enabled) => {
    if (enabled && !hasAccessibilityPermission) {
      Alert.alert(
        'Accessibility Permission Required',
        'Auto-blocking requires accessibility permission to monitor app usage. Grant permission in the next screen.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: async () => {
              await AppBlocking.openAccessibilitySettings();
              // Re-check permission after a delay
              setTimeout(checkPermissions, 2000);
            }
          }
        ]
      );
      return;
    }

    await toggleAutoBlocking(enabled);
  };

  const handleManualOverride = () => {
    if (!blockingStatus.isBlocking) return;

    Alert.alert(
      'Override App Blocking',
      `Stop blocking for "${blockingStatus.currentBlockingEvent?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop Blocking', 
          style: 'destructive',
          onPress: async () => {
            const success = await manualOverrideBlocking();
            if (success) {
              Alert.alert('Success', 'App blocking has been stopped.');
            }
          }
        }
      ]
    );
  };

  const formatTime = (date, time) => {
    if (!date || !time) return 'Invalid time';
    try {
      const eventDate = new Date(`${date}T${time}`);
      return eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Invalid date';
    try {
      const eventDate = new Date(date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (eventDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'strict': return '#FF6B6B';
      case 'non-strict': return '#95A5A6';
      default: return colors.textSecondary;
    }
  };

  const localStyles = StyleSheet.create({
    container: {
      padding: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    settingLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    statusCard: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    statusTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    activeBlockingCard: {
      backgroundColor: '#FF6B6B20',
      borderColor: '#FF6B6B',
    },
    activeBlockingText: {
      color: '#FF6B6B',
      fontWeight: 'bold',
    },
    overrideButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginTop: 8,
    },
    overrideButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    upcomingList: {
      maxHeight: 150,
    },
    eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight + '30',
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    eventText: {
      flex: 1,
      fontSize: 12,
      color: colors.textPrimary,
    },
    eventTime: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    permissionWarning: {
      backgroundColor: '#FFB34720',
      borderColor: '#FFB347',
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      marginVertical: 8,
    },
    permissionText: {
      fontSize: 12,
      color: '#B8860B',
      textAlign: 'center',
    },
    permissionButton: {
      backgroundColor: '#FFB347',
      borderRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginTop: 4,
    },
    permissionButtonText: {
      color: 'white',
      fontSize: 11,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View style={localStyles.container}>
      {/* Permission Warning */}
      {!hasAccessibilityPermission && (
        <View style={localStyles.permissionWarning}>
          <Text style={localStyles.permissionText}>
            Accessibility permission required for auto-blocking
          </Text>
          <TouchableOpacity 
            style={localStyles.permissionButton}
            onPress={() => AppBlocking.openAccessibilitySettings()}
          >
            <Text style={localStyles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Auto-blocking Toggle */}
      <View style={localStyles.section}>
        <Text style={localStyles.sectionTitle}>Auto-Blocking</Text>
        <View style={localStyles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={localStyles.settingLabel}>
              Auto-block during priority events
            </Text>
            <Text style={localStyles.settingDescription}>
              Automatically block distracting apps during events marked as "Strict"
            </Text>
          </View>
          <Switch
            value={blockingStatus.autoBlockingEnabled}
            onValueChange={handleToggleAutoBlocking}
            trackColor={{ false: colors.borderLight, true: colors.primary + '60' }}
            thumbColor={blockingStatus.autoBlockingEnabled ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>

      {/* Current Status */}
      {blockingStatus.autoBlockingEnabled && (
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Status</Text>
          
          {blockingStatus.isBlocking ? (
            <View style={[localStyles.statusCard, localStyles.activeBlockingCard]}>
              <Text style={[localStyles.statusTitle, localStyles.activeBlockingText]}>
                🚫 Blocking Active
              </Text>
              <Text style={localStyles.statusText}>
                Event: {blockingStatus.currentBlockingEvent?.title}
              </Text>
              <TouchableOpacity 
                style={localStyles.overrideButton}
                onPress={handleManualOverride}
              >
                <Text style={localStyles.overrideButtonText}>Stop Blocking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={localStyles.statusCard}>
              <Text style={localStyles.statusTitle}>
                {blockingStatus.isMonitoring ? '👁️ Monitoring Active' : '⏸️ Monitoring Inactive'}
              </Text>
              <Text style={localStyles.statusText}>
                {blockingStatus.isMonitoring 
                  ? 'Watching for strict events to start auto-blocking'
                  : 'No strict events to monitor'
                }
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Upcoming Priority Events */}
      {blockingStatus.autoBlockingEnabled && upcomingEvents.length > 0 && (
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Upcoming Priority Events</Text>
          <View style={localStyles.statusCard}>
            <View style={localStyles.upcomingList}>
              {upcomingEvents.map((event, index) => (
                <View key={event.id} style={localStyles.eventItem}>
                  <View 
                    style={[localStyles.priorityDot, { backgroundColor: getPriorityColor(event.priority) }]} 
                  />
                  <Text style={localStyles.eventText} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={localStyles.eventTime}>
                    {formatDate(event.date)} {formatTime(event.date, event.time)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AutoBlockingSettings;
