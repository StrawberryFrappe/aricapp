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
      isAllDay: eventData.isAllDay || false,
      category: eventData.category || 'Travel',
      priority: eventData.priority || 'medium', // 'low' | 'medium' | 'high'
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
    
    if (!['low', 'medium', 'high'].includes(event.priority)) {
      errors.push('Priority must be low, medium, or high');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

/**
 * Calendar Category Model
 * Defines available event categories with their properties
 */
export const CalendarCategory = {
  // Default categories matching existing CreateTask component
  categories: [
    { id: 'travel', name: 'Travel', color: '#4A90E2' },
    { id: 'work', name: 'Work', color: '#50C878' },
    { id: 'personal', name: 'Personal', color: '#FFB347' },
    { id: 'health', name: 'Health', color: '#FF6B6B' },
    { id: 'education', name: 'Education', color: '#9B59B6' },
    { id: 'social', name: 'Social', color: '#3498DB' },
    { id: 'hobby', name: 'Hobby', color: '#F39C12' },
    { id: 'other', name: 'Other', color: '#95A5A6' }
  ],

  /**
   * Get category by ID
   * @param {string} categoryId - Category identifier
   * @returns {Object|null} Category object or null if not found
   */
  getById: (categoryId) => {
    return CalendarCategory.categories.find(cat => cat.id === categoryId) || null;
  },

  /**
   * Get all category names
   * @returns {Array<string>} Array of category names
   */
  getNames: () => {
    return CalendarCategory.categories.map(cat => cat.name);
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
  CalendarCategory,
  CalendarViewState
};
