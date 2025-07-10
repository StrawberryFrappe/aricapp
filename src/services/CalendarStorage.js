/**
 * Calendar Storage Service
 * 
 * Handles all AsyncStorage operations for calendar events and related data.
 * Provides CRUD operations, data migration, and offline persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent } from '../models/CalendarModels';

const STORAGE_KEYS = {
  EVENTS: '@calendar_events',
  SETTINGS: '@calendar_settings',
  VERSION: '@calendar_version'
};

const CURRENT_VERSION = '1.0.0';

class CalendarStorage {
  /**
   * Initialize storage and perform any necessary migrations
   */
  static async initialize() {
    try {
      await this.performMigrations();
      console.log('Calendar storage initialized successfully');
    } catch (error) {
      console.error('Error initializing calendar storage:', error);
      throw error;
    }
  }

  /**
   * Get all calendar events
   * @returns {Promise<Array>} Array of calendar events
   */
  static async getAllEvents() {
    try {
      const eventsJson = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!eventsJson) return [];
      
      const events = JSON.parse(eventsJson);
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.error('Error getting all events:', error);
      return [];
    }
  }

  /**
   * Get events for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of events for the specified date
   */
  static async getEventsByDate(date) {
    try {
      const allEvents = await this.getAllEvents();
      return allEvents.filter(event => event.date === date);
    } catch (error) {
      console.error('Error getting events by date:', error);
      return [];
    }
  }

  /**
   * Get events within a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of events within the date range
   */
  static async getEventsByDateRange(startDate, endDate) {
    try {
      const allEvents = await this.getAllEvents();
      return allEvents.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    } catch (error) {
      console.error('Error getting events by date range:', error);
      return [];
    }
  }

  /**
   * Save a new event
   * @param {Object} eventData - Event data to save
   * @returns {Promise<Object>} The saved event with generated ID
   */
  static async saveEvent(eventData) {
    try {
      // Create event with validation
      const newEvent = CalendarEvent.create(eventData);
      const validation = CalendarEvent.validate(newEvent);
      
      if (!validation.isValid) {
        throw new Error(`Event validation failed: ${validation.errors.join(', ')}`);
      }

      // Get existing events
      const events = await this.getAllEvents();
      
      // Add new event
      events.push(newEvent);
      
      // Save back to storage
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      
      console.log('Event saved successfully:', newEvent.id);
      return newEvent;
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   * @param {string} eventId - ID of the event to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} The updated event
   */
  static async updateEvent(eventId, updateData) {
    try {
      const events = await this.getAllEvents();
      const eventIndex = events.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) {
        throw new Error(`Event with ID ${eventId} not found`);
      }

      // Update event with new data
      const updatedEvent = {
        ...events[eventIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Validate updated event
      const validation = CalendarEvent.validate(updatedEvent);
      if (!validation.isValid) {
        throw new Error(`Event validation failed: ${validation.errors.join(', ')}`);
      }

      // Replace event in array
      events[eventIndex] = updatedEvent;
      
      // Save back to storage
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      
      console.log('Event updated successfully:', eventId);
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   * @param {string} eventId - ID of the event to delete
   * @returns {Promise<boolean>} True if deletion was successful
   */
  static async deleteEvent(eventId) {
    try {
      const events = await this.getAllEvents();
      const filteredEvents = events.filter(event => event.id !== eventId);
      
      if (events.length === filteredEvents.length) {
        throw new Error(`Event with ID ${eventId} not found`);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filteredEvents));
      
      console.log('Event deleted successfully:', eventId);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Clear all events (use with caution)
   * @returns {Promise<boolean>} True if successful
   */
  static async clearAllEvents() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
      console.log('All events cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all events:', error);
      throw error;
    }
  }

  /**
   * Get calendar settings
   * @returns {Promise<Object>} Calendar settings object
   */
  static async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) {
        return {
          weekStartsOn: 1, // Monday = 1, Sunday = 0
          defaultView: 'month',
          defaultEventDuration: 60 // minutes
        };
      }
      
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error('Error getting calendar settings:', error);
      return {};
    }
  }

  /**
   * Save calendar settings
   * @param {Object} settings - Settings to save
   * @returns {Promise<boolean>} True if successful
   */
  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      console.log('Calendar settings saved');
      return true;
    } catch (error) {
      console.error('Error saving calendar settings:', error);
      throw error;
    }
  }

  /**
   * Perform data migrations if necessary
   * @private
   */
  static async performMigrations() {
    try {
      const currentVersion = await AsyncStorage.getItem(STORAGE_KEYS.VERSION);
      
      if (!currentVersion) {
        // First time setup
        await this.migrateFromLegacyStorage();
        await AsyncStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      }
      
      // Future migrations can be added here
      // if (currentVersion < '2.0.0') { ... }
      
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  /**
   * Migrate from any legacy storage format
   * @private
   */
  static async migrateFromLegacyStorage() {
    try {
      // Check for any existing task/event data that might need migration
      // For now, we'll start fresh since this is initial implementation
      console.log('Initializing fresh calendar storage');
    } catch (error) {
      console.error('Error migrating legacy storage:', error);
    }
  }

  /**
   * Export events as JSON (for backup/sync)
   * @returns {Promise<string>} JSON string of all events
   */
  static async exportEvents() {
    try {
      const events = await this.getAllEvents();
      return JSON.stringify(events, null, 2);
    } catch (error) {
      console.error('Error exporting events:', error);
      throw error;
    }
  }

  /**
   * Import events from JSON (for backup/sync)
   * @param {string} eventsJson - JSON string of events
   * @param {boolean} replace - Whether to replace existing events
   * @returns {Promise<number>} Number of events imported
   */
  static async importEvents(eventsJson, replace = false) {
    try {
      const importedEvents = JSON.parse(eventsJson);
      
      if (!Array.isArray(importedEvents)) {
        throw new Error('Invalid events data format');
      }

      // Validate all events
      for (const eventData of importedEvents) {
        const validation = CalendarEvent.validate(eventData);
        if (!validation.isValid) {
          console.warn('Skipping invalid event:', eventData, validation.errors);
          continue;
        }
      }

      let existingEvents = replace ? [] : await this.getAllEvents();
      
      // Merge with existing events (avoiding duplicates by ID)
      const existingIds = new Set(existingEvents.map(e => e.id));
      const newEvents = importedEvents.filter(e => !existingIds.has(e.id));
      
      const finalEvents = [...existingEvents, ...newEvents];
      
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(finalEvents));
      
      console.log(`Imported ${newEvents.length} events`);
      return newEvents.length;
    } catch (error) {
      console.error('Error importing events:', error);
      throw error;
    }
  }
}

export default CalendarStorage;
