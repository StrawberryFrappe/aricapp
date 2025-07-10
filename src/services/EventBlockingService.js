/**
 * Event Blocking Service
 * 
 * Bridges calendar events with app blocking functionality.
 * Monitors active calendar events and automatically starts/stops app blocking
 * for strict priority events based on their timing.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Alert, DeviceEventEmitter } from 'react-native';
import AppBlocking from './AppBlocking';
import BlockingStatsService from './BlockingStatsService';

class EventBlockingService {
  constructor() {
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.currentBlockingEvent = null;
    this.autoBlockingEnabled = false;
    this.onStatusChangeCallbacks = [];
    this.appStateSubscription = null;
    this.blockingAttemptListener = null;
    this.manuallyOverriddenEvents = new Set(); // Track events that were manually overridden
    
    // Initialize service
    this.initialize();
  }

  /**
   * Initialize the service
   */
  async initialize() {
    try {
      // Load auto-blocking preference
      const autoBlockingPref = await AsyncStorage.getItem('autoBlockingEnabled');
      this.autoBlockingEnabled = autoBlockingPref === 'true';
      
      // Setup app state monitoring
      this.setupAppStateMonitoring();
      
      // Setup callback for individual blocking attempts
      this.setupBlockingAttemptCallback();
      
      console.log('EventBlockingService initialized');
    } catch (error) {
      console.error('Error initializing EventBlockingService:', error);
    }
  }

  /**
   * Setup listener for blocking attempt events from native module
   */
  async setupBlockingAttemptCallback() {
    try {
      // Enable the callback in native module
      await AppBlocking.setBlockingAttemptCallback();
      
      // Setup event listener
      this.blockingAttemptListener = DeviceEventEmitter.addListener(
        'AppBlockingAttempt',
        (event) => {
          console.log(`User attempted to access blocked app: ${event.packageName}`);
          BlockingStatsService.recordBlockingAttempt(event.packageName);
        }
      );
      
      console.log('Blocking attempt callback setup complete');
    } catch (error) {
      console.error('Error setting up blocking attempt callback:', error);
    }
  }

  /**
   * Setup app state monitoring to handle background/foreground transitions
   */
  setupAppStateMonitoring() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' && this.isMonitoring) {
        // Continue monitoring in background (limited by platform constraints)
        console.log('App backgrounded, continuing event monitoring');
      } else if (nextAppState === 'active' && this.isMonitoring) {
        // Resume active monitoring when app comes to foreground
        console.log('App foregrounded, resuming active monitoring');
        this.checkCurrentEvents();
      }
    });
  }

  /**
   * Start monitoring calendar events for auto-blocking
   * @param {Array} events - Array of calendar events to monitor
   */
  startMonitoring(events) {
    if (!this.autoBlockingEnabled) {
      console.log('Auto-blocking disabled, not starting monitoring');
      return;
    }

    this.isMonitoring = true;
    this.events = events || [];
    
    // Initial check
    this.checkCurrentEvents();
    
    // Set up interval monitoring (check every 30 seconds)
    this.monitoringInterval = setInterval(() => {
      this.checkCurrentEvents();
    }, 30000);
    
    console.log('Event monitoring started');
    this.notifyStatusChange();
  }

  /**
   * Stop monitoring calendar events
   */
  stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    // Stop any active blocking
    if (this.currentBlockingEvent) {
      this.stopEventBlocking();
    }
    
    console.log('Event monitoring stopped');
    this.notifyStatusChange();
  }

  /**
   * Check for currently active events that should trigger blocking
   */
  async checkCurrentEvents() {
    if (!this.autoBlockingEnabled || !this.events) return;

    const now = new Date();
    const currentTime = now.getTime();
    
    // Find active events (currently happening)
    const activeEvents = this.events.filter(event => {
      if (!event.date || !event.time) return false;
      
      // Only block for strict priority events that haven't been manually overridden
      if (event.priority !== 'strict') return false;
      if (this.manuallyOverriddenEvents.has(event.id)) return false;
      
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      const eventEndTime = new Date(eventDateTime.getTime() + (event.duration || 60) * 60000); // Default 1 hour duration
      
      return currentTime >= eventDateTime.getTime() && currentTime <= eventEndTime.getTime();
    });

    // Handle blocking state changes
    if (activeEvents.length > 0 && !this.currentBlockingEvent) {
      // Start blocking for the first active strict event
      const activeEvent = activeEvents[0]; // Since all are strict priority, just take the first one
      console.log(`Found ${activeEvents.length} active strict events, starting blocking for: ${activeEvent.title}`);
      await this.startEventBlocking(activeEvent);
    } else if (activeEvents.length === 0 && this.currentBlockingEvent) {
      // Stop blocking when no active events (or event ended)
      console.log('No more active events, stopping blocking');
      await this.stopEventBlocking();
    } else if (activeEvents.length > 0 && this.currentBlockingEvent) {
      console.log(`${activeEvents.length} active events found, but blocking already active for: ${this.currentBlockingEvent.title}`);
    }
  }

  /**
   * Start app blocking for a specific event
   * @param {Object} event - Calendar event
   */
  async startEventBlocking(event) {
    try {
      // Check permissions
      const hasAccessibility = await AppBlocking.isAccessibilityEnabled();
      if (!hasAccessibility) {
        console.log('Accessibility permission not granted, cannot start blocking');
        return false;
      }

      // Get user's selected apps - this is critical for proper blocking
      let blockedApps = await AppBlocking.getSelectedApps();
      
      console.log('Retrieved selected apps for blocking:', blockedApps);
      
      // Ensure we have an array and it's not empty
      if (!Array.isArray(blockedApps) || blockedApps.length === 0) {
        console.warn('No apps selected for blocking! User needs to configure app blocking preferences.');
        
        // Show user notification about missing app selection
        this.showBlockingNotification(
          `Cannot start blocking for "${event.title}" - No apps selected for blocking. Please configure your app preferences in Settings.`,
          true
        );
        
        return false;
      }

      // Calculate remaining duration
      const now = new Date();
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      const eventEndTime = new Date(eventDateTime.getTime() + (event.duration || 60) * 60000);
      const remainingSeconds = Math.max(0, Math.floor((eventEndTime.getTime() - now.getTime()) / 1000));

      if (remainingSeconds > 0) {
        const success = await AppBlocking.startBlocking(remainingSeconds, blockedApps);
        if (success) {
          this.currentBlockingEvent = event;
          console.log(`Started auto-blocking for event: ${event.title} (${remainingSeconds}s remaining)`);
          
          // Note: Individual blocking attempts will be counted via callback
          // when users actually try to access blocked apps
          
          // Show user notification
          this.showBlockingNotification(`Auto-blocking started for "${event.title}"`, false);
          
          this.notifyStatusChange();
          return true;
        }
      }
    } catch (error) {
      console.error('Error starting event blocking:', error);
    }
    return false;
  }

  /**
   * Stop app blocking for the current event
   */
  async stopEventBlocking() {
    try {
      await AppBlocking.stopBlocking();
      const eventTitle = this.currentBlockingEvent?.title || 'Unknown event';
      this.currentBlockingEvent = null;
      console.log(`Stopped auto-blocking for event: ${eventTitle}`);
      
      // Show user notification
      this.showBlockingNotification(`Auto-blocking stopped for "${eventTitle}"`, true);
      
      this.notifyStatusChange();
    } catch (error) {
      console.error('Error stopping event blocking:', error);
    }
  }

  /**
   * Manually override and stop current blocking
   */
  async manualOverride() {
    if (this.currentBlockingEvent) {
      // Mark this event as manually overridden so it won't restart blocking
      this.manuallyOverriddenEvents.add(this.currentBlockingEvent.id);
      await this.stopEventBlocking();
      return true;
    }
    return false;
  }

  /**
   * Enable or disable auto-blocking
   * @param {boolean} enabled - Whether auto-blocking should be enabled
   */
  async setAutoBlockingEnabled(enabled) {
    this.autoBlockingEnabled = enabled;
    await AsyncStorage.setItem('autoBlockingEnabled', enabled.toString());
    
    if (enabled && this.events && this.events.length > 0) {
      this.startMonitoring(this.events);
    } else if (!enabled) {
      this.stopMonitoring();
    }
    
    console.log(`Auto-blocking ${enabled ? 'enabled' : 'disabled'}`);
    this.notifyStatusChange();
  }

  /**
   * Get current auto-blocking status
   */
  getStatus() {
    return {
      autoBlockingEnabled: this.autoBlockingEnabled,
      isMonitoring: this.isMonitoring,
      currentBlockingEvent: this.currentBlockingEvent,
      isBlocking: !!this.currentBlockingEvent
    };
  }

  /**
   * Update events being monitored
   * @param {Array} events - New array of events
   */
  updateEvents(events) {
    this.events = events;
    
    // Clean up overridden events that are no longer active
    this.cleanupExpiredOverrides();
    
    if (this.isMonitoring) {
      this.checkCurrentEvents();
    }
  }

  /**
   * Clean up overridden events that are no longer active
   */
  cleanupExpiredOverrides() {
    if (!this.events || this.manuallyOverriddenEvents.size === 0) return;
    
    const now = new Date().getTime();
    const activeEventIds = new Set();
    
    // Find currently active events
    this.events.forEach(event => {
      if (event.date && event.time) {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const eventEndTime = new Date(eventDateTime.getTime() + (event.duration || 60) * 60000);
        
        if (now >= eventDateTime.getTime() && now <= eventEndTime.getTime()) {
          activeEventIds.add(event.id);
        }
      }
    });
    
    // Remove overrides for events that are no longer active
    for (const eventId of this.manuallyOverriddenEvents) {
      if (!activeEventIds.has(eventId)) {
        this.manuallyOverriddenEvents.delete(eventId);
      }
    }
  }

  /**
   * Add status change callback
   * @param {Function} callback - Callback function to call on status changes
   */
  onStatusChange(callback) {
    this.onStatusChangeCallbacks.push(callback);
    return () => {
      this.onStatusChangeCallbacks = this.onStatusChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all callbacks of status changes
   */
  notifyStatusChange() {
    const status = this.getStatus();
    this.onStatusChangeCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status change callback:', error);
      }
    });
  }

  /**
   * Clean up the service
   */
  cleanup() {
    this.stopMonitoring();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    if (this.blockingAttemptListener) {
      this.blockingAttemptListener.remove();
      this.blockingAttemptListener = null;
    }
    this.onStatusChangeCallbacks = [];
  }

  /**
   * Show user notification for blocking events
   * @param {string} message - Notification message
   * @param {boolean} isStop - Whether this is a stop notification
   */
  showBlockingNotification(message, isStop = false) {
    // Only show notifications when app is in foreground
    if (AppState.currentState === 'active') {
      Alert.alert(
        isStop ? '🔓 Auto-Blocking Stopped' : '🚫 Auto-Blocking Started',
        message,
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }
  }

  /**
   * Check if user has configured app blocking preferences
   * @returns {boolean} Whether user has selected apps for blocking
   */
  async hasConfiguredApps() {
    try {
      const selectedApps = await AppBlocking.getSelectedApps();
      return selectedApps && selectedApps.length > 0;
    } catch (error) {
      console.error('Error checking configured apps:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new EventBlockingService();
