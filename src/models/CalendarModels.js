/**
 * Calendar Data Models
 * 
 * Defines the data structures for calendar events and related entities.
 * Used throughout the calendar system for type consistency and validation.
 */

/**
 * Calendar Event Model
 * Represents a single calendar event/task
 */
export const CalendarEvent = {
  /**
   * Creates a new calendar event with default values
   * @param {Object} eventData - Event data to merge with defaults
   * @returns {Object} Complete event object
   */
  create: (eventData = {}) => {
    const now = new Date().toISOString();
    return {
      id: eventData.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      time: eventData.time || '09:00', // HH:mm format
      priority: eventData.priority || 'non-strict', // 'strict' | 'non-strict'
      completed: eventData.completed || false,
      createdAt: eventData.createdAt || now,
      updatedAt: eventData.updatedAt || now,
      ...eventData
    };
  },

  /**
   * Validates an event object
   * @param {Object} event - Event to validate
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validate: (event) => {
    const errors = [];
    
    if (!event.title || event.title.trim().length === 0) {
      errors.push('Event title is required');
    }
    
    if (!event.date || !isValidDate(event.date)) {
      errors.push('Valid date is required');
    }
    
    if (!event.time || !isValidTime(event.time)) {
      errors.push('Valid time is required');
    }
    
    if (!['strict', 'non-strict'].includes(event.priority)) {
      errors.push('Priority must be strict or non-strict');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

/**
 * Calendar View State Model
 * Manages calendar view preferences and navigation state
 */
export const CalendarViewState = {
  create: (viewData = {}) => ({
    currentView: viewData.currentView || 'month', // 'month' | 'week' | 'day'
    currentDate: viewData.currentDate || new Date().toISOString(),
    selectedDate: viewData.selectedDate || null,
    ...viewData
  })
};

// Helper functions
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const isValidTime = (timeString) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeString);
};

export default {
  CalendarEvent,
  CalendarViewState
};
