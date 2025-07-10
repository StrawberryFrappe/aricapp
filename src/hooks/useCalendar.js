/**
 * Calendar Operations Hook
 * 
 * Custom hook providing calendar operations, event filtering, sorting,
 * and date utilities. Built on top of CalendarContext for state management.
 */

import { useMemo, useCallback } from 'react';
import { useCalendarContext } from '../context/CalendarContext';

/**
 * Custom hook for calendar operations
 * @returns {Object} Calendar operations and utilities
 */
export const useCalendar = () => {
  const context = useCalendarContext();

  /**
   * Event filtering and sorting utilities
   */
  const eventUtils = useMemo(() => ({
    /**
     * Filter events by category
     */
    filterByCategory: (category) => {
      return context.events.filter(event => event.category === category);
    },

    /**
     * Filter events by priority
     */
    filterByPriority: (priority) => {
      return context.events.filter(event => event.priority === priority);
    },

    /**
     * Filter events by completion status
     */
    filterByCompletion: (completed = false) => {
      return context.events.filter(event => event.completed === completed);
    },

    /**
     * Search events by title or description
     */
    searchEvents: (query) => {
      const lowercaseQuery = query.toLowerCase();
      return context.events.filter(event => 
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery)
      );
    },

    /**
     * Sort events by date and time
     */
    sortByDateTime: (eventsArray) => {
      return [...eventsArray].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
    },

    /**
     * Sort events by priority (strict first, then non-strict)
     */
    sortByPriority: (eventsArray) => {
      const priorityOrder = { 'strict': 2, 'non-strict': 1 };
      return [...eventsArray].sort((a, b) => 
        priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    },

    /**
     * Group events by date
     */
    groupByDate: (eventsArray) => {
      return eventsArray.reduce((groups, event) => {
        if (!groups[event.date]) {
          groups[event.date] = [];
        }
        groups[event.date].push(event);
        return groups;
      }, {});
    },

    /**
     * Group events by category
     */
    groupByCategory: (eventsArray) => {
      return eventsArray.reduce((groups, event) => {
        if (!groups[event.category]) {
          groups[event.category] = [];
        }
        groups[event.category].push(event);
        return groups;
      }, {});
    }
  }), [context.events]);

  /**
   * Date utilities
   */
  const dateUtils = useMemo(() => ({
    /**
     * Get today's date in YYYY-MM-DD format
     */
    getToday: () => {
      return new Date().toISOString().split('T')[0];
    },

    /**
     * Format date for display
     */
    formatDate: (dateString, options = {}) => {
      const date = new Date(dateString);
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
      };
      return date.toLocaleDateString('en-US', defaultOptions);
    },

    /**
     * Format time for display
     */
    formatTime: (timeString, use24Hour = false) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: !use24Hour
      });
    },

    /**
     * Check if date is today
     */
    isToday: (dateString) => {
      return dateString === dateUtils.getToday();
    },

    /**
     * Check if date is in the past
     */
    isPast: (dateString) => {
      return dateString < dateUtils.getToday();
    },

    /**
     * Check if date is in the future
     */
    isFuture: (dateString) => {
      return dateString > dateUtils.getToday();
    },

    /**
     * Get days in month
     */
    getDaysInMonth: (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    },

    /**
     * Get first day of month (0 = Sunday, 1 = Monday, etc.)
     */
    getFirstDayOfMonth: (year, month) => {
      return new Date(year, month, 1).getDay();
    },

    /**
     * Get calendar grid for month view
     */
    getMonthGrid: (year, month) => {
      const daysInMonth = dateUtils.getDaysInMonth(year, month);
      const firstDay = dateUtils.getFirstDayOfMonth(year, month);
      const startDate = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
      
      const grid = [];
      let currentWeek = [];
      
      // Previous month days
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = dateUtils.getDaysInMonth(prevYear, prevMonth);
      
      for (let i = startDate - 1; i >= 0; i--) {
        currentWeek.unshift({
          day: daysInPrevMonth - i,
          isCurrentMonth: false,
          isPrevMonth: true,
          date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`
        });
      }
      
      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        if (currentWeek.length === 7) {
          grid.push(currentWeek);
          currentWeek = [];
        }
        
        currentWeek.push({
          day,
          isCurrentMonth: true,
          isPrevMonth: false,
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        });
      }
      
      // Next month days
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      let nextMonthDay = 1;
      
      while (currentWeek.length < 7) {
        currentWeek.push({
          day: nextMonthDay,
          isCurrentMonth: false,
          isPrevMonth: false,
          date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`
        });
        nextMonthDay++;
      }
      
      if (currentWeek.length > 0) {
        grid.push(currentWeek);
      }
      
      // Ensure we have 6 weeks
      while (grid.length < 6) {
        const newWeek = [];
        for (let i = 0; i < 7; i++) {
          newWeek.push({
            day: nextMonthDay,
            isCurrentMonth: false,
            isPrevMonth: false,
            date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`
          });
          nextMonthDay++;
        }
        grid.push(newWeek);
      }
      
      return grid;
    },

    /**
     * Get week dates for week view
     */
    getWeekDates: (date) => {
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date.toISOString().split('T')[0]);
      }
      
      return weekDates;
    }
  }), []);

  /**
   * Current view data with memoization
   */
  const currentViewData = useMemo(() => {
    const currentDate = new Date(context.viewState.currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    switch (context.viewState.currentView) {
      case 'month':
        return {
          type: 'month',
          title: dateUtils.formatDate(context.viewState.currentDate, { month: 'long', year: 'numeric' }),
          grid: dateUtils.getMonthGrid(year, month),
          events: context.getCurrentMonthEvents()
        };
      
      case 'week':
        const weekDates = dateUtils.getWeekDates(context.viewState.currentDate);
        return {
          type: 'week',
          title: `Week of ${dateUtils.formatDate(weekDates[0], { month: 'short', day: 'numeric' })}`,
          dates: weekDates,
          events: context.getEventsByDateRange(weekDates[0], weekDates[6])
        };
      
      case 'day':
        return {
          type: 'day',
          title: dateUtils.formatDate(context.viewState.currentDate),
          date: context.viewState.currentDate.split('T')[0],
          events: context.getEventsByDate(context.viewState.currentDate.split('T')[0])
        };
      
      default:
        return null;
    }
  }, [context.viewState, context.getCurrentMonthEvents, context.getEventsByDateRange, context.getEventsByDate, dateUtils]);

  /**
   * Today's events with quick access
   */
  const todayEvents = useMemo(() => {
    const today = dateUtils.getToday();
    return eventUtils.sortByDateTime(context.getEventsByDate(today));
  }, [context.getEventsByDate, dateUtils, eventUtils]);

  /**
   * Upcoming events (next 7 days)
   */
  const upcomingEvents = useMemo(() => {
    const today = dateUtils.getToday();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const endDate = nextWeek.toISOString().split('T')[0];
    
    return eventUtils.sortByDateTime(
      context.getEventsByDateRange(today, endDate)
    );
  }, [context.getEventsByDateRange, dateUtils, eventUtils]);

  // Return enhanced context with utilities
  return {
    ...context,
    eventUtils,
    dateUtils,
    currentViewData,
    todayEvents,
    upcomingEvents
  };
};

export default useCalendar;
