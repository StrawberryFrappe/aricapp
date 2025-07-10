/**
 * Calendar Context
 * 
 * Provides global state management for calendar data and operations.
 * Handles event loading, caching, and state synchronization across components.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CalendarStorage from '../services/CalendarStorage';
import { CalendarEvent, CalendarViewState } from '../models/CalendarModels';
import EventBlockingService from '../services/EventBlockingService';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  // Core state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // View state
  const [viewState, setViewState] = useState(() => CalendarViewState.create());
  
  // Cache state
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-blocking state
  const [blockingStatus, setBlockingStatus] = useState({
    autoBlockingEnabled: false,
    isMonitoring: false,
    currentBlockingEvent: null,
    isBlocking: false
  });

  /**
   * Initialize calendar data on mount
   */
  useEffect(() => {
    initializeCalendar();
    
    // Setup blocking service status monitoring
    const unsubscribe = EventBlockingService.onStatusChange((status) => {
      setBlockingStatus(status);
    });

    // Initialize blocking status
    setBlockingStatus(EventBlockingService.getStatus());

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Update events being monitored
   */
  useEffect(() => {
    if (events.length > 0) {
      EventBlockingService.updateEvents(events);
      
      // Auto-start monitoring if auto-blocking is enabled
      const status = EventBlockingService.getStatus();
      if (status.autoBlockingEnabled && !status.isMonitoring) {
        EventBlockingService.startMonitoring(events);
      }
    }
  }, [events]);

  const initializeCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize storage
      await CalendarStorage.initialize();
      
      // Load all events
      const loadedEvents = await CalendarStorage.getAllEvents();
      setEvents(loadedEvents);
      setLastRefresh(new Date());
      
      console.log(`Loaded ${loadedEvents.length} calendar events`);
    } catch (err) {
      console.error('Error initializing calendar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh events from storage
   */
  const refreshEvents = useCallback(async () => {
    try {
      setLoading(true);
      const loadedEvents = await CalendarStorage.getAllEvents();
      setEvents(loadedEvents);
      setLastRefresh(new Date());
      setIsDirty(false);
    } catch (err) {
      console.error('Error refreshing events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new event
   */
  const createEvent = useCallback(async (eventData) => {
    try {
      setError(null);
      const newEvent = await CalendarStorage.saveEvent(eventData);
      
      // Update local state
      setEvents(prevEvents => [...prevEvents, newEvent]);
      setIsDirty(true);
      
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Update an existing event
   */
  const updateEvent = useCallback(async (eventId, updateData) => {
    try {
      setError(null);
      const updatedEvent = await CalendarStorage.updateEvent(eventId, updateData);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent : event
        )
      );
      setIsDirty(true);
      
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Delete an event
   */
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      await CalendarStorage.deleteEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== eventId)
      );
      setIsDirty(true);
      
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Get events for a specific date
   */
  const getEventsByDate = useCallback((date) => {
    return events.filter(event => event.date === date);
  }, [events]);

  /**
   * Get events within a date range
   */
  const getEventsByDateRange = useCallback((startDate, endDate) => {
    return events.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
  }, [events]);

  /**
   * Get events for current month
   */
  const getCurrentMonthEvents = useCallback(() => {
    const currentDate = new Date(viewState.currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    return getEventsByDateRange(startDate, endDate);
  }, [viewState.currentDate, getEventsByDateRange]);

  /**
   * Navigation functions
   */
  const navigateToDate = useCallback((date) => {
    setViewState(prev => ({
      ...prev,
      currentDate: date instanceof Date ? date.toISOString() : date,
      selectedDate: date instanceof Date ? date.toISOString().split('T')[0] : date
    }));
  }, []);

  const navigateToToday = useCallback(() => {
    const today = new Date();
    setViewState(prev => ({
      ...prev,
      currentDate: today.toISOString(),
      selectedDate: today.toISOString().split('T')[0]
    }));
  }, []);

  const navigateToNextMonth = useCallback(() => {
    const currentDate = new Date(viewState.currentDate);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setViewState(prev => ({
      ...prev,
      currentDate: nextMonth.toISOString()
    }));
  }, [viewState.currentDate]);

  const navigateToPreviousMonth = useCallback(() => {
    const currentDate = new Date(viewState.currentDate);
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setViewState(prev => ({
      ...prev,
      currentDate: prevMonth.toISOString()
    }));
  }, [viewState.currentDate]);

  /**
   * View management
   */
  const setCalendarView = useCallback((view) => {
    setViewState(prev => ({
      ...prev,
      currentView: view
    }));
  }, []);

  const selectDate = useCallback((date) => {
    setViewState(prev => ({
      ...prev,
      selectedDate: date
    }));
  }, []);

  /**
   * Utility functions
   */
  const getEventsCount = useCallback(() => events.length, [events.length]);

  const getCompletedEventsCount = useCallback(() => {
    return events.filter(event => event.completed).length;
  }, [events]);

  const getPendingEventsCount = useCallback(() => {
    return events.filter(event => !event.completed).length;
  }, [events]);

  const hasEventsOnDate = useCallback((date) => {
    return events.some(event => event.date === date);
  }, [events]);

  /**
   * Auto-blocking functions
   */
  const toggleAutoBlocking = useCallback(async (enabled) => {
    try {
      await EventBlockingService.setAutoBlockingEnabled(enabled);
      if (enabled && events.length > 0) {
        EventBlockingService.startMonitoring(events);
      }
    } catch (error) {
      console.error('Error toggling auto-blocking:', error);
      setError(error.message);
    }
  }, [events]);

  const manualOverrideBlocking = useCallback(async () => {
    try {
      return await EventBlockingService.manualOverride();
    } catch (error) {
      console.error('Error with manual override:', error);
      setError(error.message);
      return false;
    }
  }, []);

  const startEventMonitoring = useCallback(() => {
    if (events.length > 0) {
      EventBlockingService.startMonitoring(events);
    }
  }, [events]);

  const stopEventMonitoring = useCallback(() => {
    EventBlockingService.stopMonitoring();
  }, []);

  const getUpcomingPriorityEvents = useCallback(() => {
    const now = new Date();
    const nowTime = now.getTime();
    
    return events.filter(event => {
      if (!event.date || !event.time) return false;
      if (event.priority !== 'strict') return false;
      
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      return eventDateTime.getTime() > nowTime;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  // Context value
  const contextValue = {
    // State
    events,
    loading,
    error,
    viewState,
    lastRefresh,
    isDirty,
    blockingStatus,

    // Event operations
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,

    // Event queries
    getEventsByDate,
    getEventsByDateRange,
    getCurrentMonthEvents,

    // Navigation
    navigateToDate,
    navigateToToday,
    navigateToNextMonth,
    navigateToPreviousMonth,

    // View management
    setCalendarView,
    selectDate,

    // Utilities
    getEventsCount,
    getCompletedEventsCount,
    getPendingEventsCount,
    hasEventsOnDate,

    // Auto-blocking
    toggleAutoBlocking,
    manualOverrideBlocking,
    startEventMonitoring,
    stopEventMonitoring,
    getUpcomingPriorityEvents,

    // Actions
    initializeCalendar
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};

/**
 * Hook to use calendar context
 */
export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within CalendarProvider');
  }
  return context;
};

export default CalendarContext;
