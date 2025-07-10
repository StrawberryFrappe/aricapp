/**
 * Calendar Utilities
 * 
 * Core date calculation functions, month grid generation, and calendar helper utilities.
 * Pure functions for calendar logic without React dependencies.
 */

/**
 * Date calculation utilities
 */
export const DateCalculations = {
  /**
   * Get the number of days in a specific month
   * @param {number} year - Full year (e.g., 2025)
   * @param {number} month - Month (0-11, JavaScript Date convention)
   * @returns {number} Number of days in the month
   */
  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  /**
   * Get the day of the week for the first day of a month
   * @param {number} year - Full year
   * @param {number} month - Month (0-11)
   * @returns {number} Day of week (0 = Sunday, 1 = Monday, etc.)
   */
  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  },

  /**
   * Get the day of the week for the last day of a month
   * @param {number} year - Full year
   * @param {number} month - Month (0-11)
   * @returns {number} Day of week (0 = Sunday, 1 = Monday, etc.)
   */
  getLastDayOfMonth(year, month) {
    const daysInMonth = this.getDaysInMonth(year, month);
    return new Date(year, month, daysInMonth).getDay();
  },

  /**
   * Check if a year is a leap year
   * @param {number} year - Full year
   * @returns {boolean} True if leap year
   */
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },

  /**
   * Get today's date in YYYY-MM-DD format
   * @returns {string} Today's date
   */
  getToday() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Add days to a date
   * @param {string|Date} date - Starting date
   * @param {number} days - Number of days to add (can be negative)
   * @returns {string} New date in YYYY-MM-DD format
   */
  addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().split('T')[0];
  },

  /**
   * Add months to a date
   * @param {string|Date} date - Starting date
   * @param {number} months - Number of months to add (can be negative)
   * @returns {string} New date in YYYY-MM-DD format
   */
  addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate.toISOString().split('T')[0];
  },

  /**
   * Get the difference in days between two dates
   * @param {string|Date} date1 - First date
   * @param {string|Date} date2 - Second date
   * @returns {number} Difference in days (positive if date2 is later)
   */
  daysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if two dates are the same day
   * @param {string|Date} date1 - First date
   * @param {string|Date} date2 - Second date
   * @returns {boolean} True if same day
   */
  isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  },

  /**
   * Check if a date is today
   * @param {string|Date} date - Date to check
   * @returns {boolean} True if date is today
   */
  isToday(date) {
    return this.isSameDay(date, new Date());
  },

  /**
   * Check if a date is in the past
   * @param {string|Date} date - Date to check
   * @returns {boolean} True if date is in the past
   */
  isPast(date) {
    const today = new Date();
    const checkDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  },

  /**
   * Check if a date is in the future
   * @param {string|Date} date - Date to check
   * @returns {boolean} True if date is in the future
   */
  isFuture(date) {
    const today = new Date();
    const checkDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  }
};

/**
 * Month grid generation for calendar display
 */
export const MonthGrid = {
  /**
   * Generate a complete month grid for calendar display
   * @param {number} year - Full year
   * @param {number} month - Month (0-11)
   * @param {number} weekStartsOn - First day of week (0 = Sunday, 1 = Monday)
   * @returns {Array<Array<Object>>} 6-week grid of day objects
   */
  generate(year, month, weekStartsOn = 1) {
    const daysInMonth = DateCalculations.getDaysInMonth(year, month);
    const firstDay = DateCalculations.getFirstDayOfMonth(year, month);
    
    // Adjust first day based on week start preference
    const adjustedFirstDay = weekStartsOn === 0 ? firstDay : 
      (firstDay === 0 ? 6 : firstDay - 1);
    
    const grid = [];
    let currentWeek = [];
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = DateCalculations.getDaysInMonth(prevYear, prevMonth);
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      currentWeek.unshift(this.createDayObject(
        day, prevYear, prevMonth, false, true
      ));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(this.createDayObject(
        day, year, month, true, false
      ));
    }
    
    // Next month days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let nextMonthDay = 1;
    
    while (currentWeek.length < 7) {
      currentWeek.push(this.createDayObject(
        nextMonthDay, nextYear, nextMonth, false, false
      ));
      nextMonthDay++;
    }
    
    if (currentWeek.length > 0) {
      grid.push(currentWeek);
    }
    
    // Ensure exactly 6 weeks (42 days) for consistent grid height
    while (grid.length < 6) {
      const newWeek = [];
      for (let i = 0; i < 7; i++) {
        newWeek.push(this.createDayObject(
          nextMonthDay, nextYear, nextMonth, false, false
        ));
        nextMonthDay++;
      }
      grid.push(newWeek);
    }
    
    return grid;
  },

  /**
   * Create a day object for grid cell
   * @param {number} day - Day number
   * @param {number} year - Full year
   * @param {number} month - Month (0-11)
   * @param {boolean} isCurrentMonth - Whether day belongs to current month
   * @param {boolean} isPrevMonth - Whether day belongs to previous month
   * @returns {Object} Day object with metadata
   */
  createDayObject(day, year, month, isCurrentMonth, isPrevMonth) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return {
      day,
      date,
      year,
      month,
      isCurrentMonth,
      isPrevMonth,
      isNextMonth: !isCurrentMonth && !isPrevMonth,
      isToday: DateCalculations.isToday(date),
      isPast: DateCalculations.isPast(date),
      isFuture: DateCalculations.isFuture(date),
      isWeekend: this.isWeekend(year, month, day)
    };
  },

  /**
   * Check if a day is a weekend
   * @param {number} year - Full year
   * @param {number} month - Month (0-11)
   * @param {number} day - Day number
   * @returns {boolean} True if weekend (Saturday or Sunday)
   */
  isWeekend(year, month, day) {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
};

/**
 * Week helpers for week view
 */
export const WeekHelpers = {
  /**
   * Get week dates starting from a specific date
   * @param {string|Date} date - Reference date
   * @param {number} weekStartsOn - First day of week (0 = Sunday, 1 = Monday)
   * @returns {Array<string>} Array of 7 date strings
   */
  getWeekDates(date, weekStartsOn = 1) {
    const referenceDate = new Date(date);
    const dayOfWeek = referenceDate.getDay();
    
    // Calculate start of week
    let daysFromStart;
    if (weekStartsOn === 0) {
      daysFromStart = dayOfWeek;
    } else {
      daysFromStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    }
    
    const startOfWeek = new Date(referenceDate);
    startOfWeek.setDate(referenceDate.getDate() - daysFromStart);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    return weekDates;
  },

  /**
   * Get week number of the year
   * @param {string|Date} date - Date to get week number for
   * @returns {number} Week number (1-53)
   */
  getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
};

/**
 * Time utilities
 */
export const TimeUtils = {
  /**
   * Parse time string to minutes since midnight
   * @param {string} timeString - Time in HH:mm format
   * @returns {number} Minutes since midnight
   */
  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  },

  /**
   * Convert minutes since midnight to time string
   * @param {number} minutes - Minutes since midnight
   * @returns {string} Time in HH:mm format
   */
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  },

  /**
   * Format time for display
   * @param {string} timeString - Time in HH:mm format
   * @param {boolean} use24Hour - Whether to use 24-hour format
   * @returns {string} Formatted time string
   */
  formatTime(timeString, use24Hour = false) {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (use24Hour) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  },

  /**
   * Get current time in HH:mm format
   * @returns {string} Current time
   */
  getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  },

  /**
   * Check if time is in the past for today
   * @param {string} timeString - Time in HH:mm format
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {boolean} True if time is in the past
   */
  isTimePast(timeString, dateString) {
    if (!DateCalculations.isToday(dateString)) {
      return DateCalculations.isPast(dateString);
    }
    
    const currentMinutes = this.timeToMinutes(this.getCurrentTime());
    const eventMinutes = this.timeToMinutes(timeString);
    return eventMinutes < currentMinutes;
  }
};

/**
 * Date formatting utilities
 */
export const DateFormatters = {
  /**
   * Format date for display with various options
   * @param {string|Date} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date string
   */
  formatDate(date, options = {}) {
    const d = new Date(date);
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    return d.toLocaleDateString('en-US', defaultOptions);
  },

  /**
   * Format date for short display (e.g., "Jan 15")
   * @param {string|Date} date - Date to format
   * @returns {string} Short formatted date
   */
  formatDateShort(date) {
    return this.formatDate(date, { month: 'short', day: 'numeric' });
  },

  /**
   * Format date for month/year display
   * @param {string|Date} date - Date to format
   * @returns {string} Month and year
   */
  formatMonthYear(date) {
    return this.formatDate(date, { month: 'long', year: 'numeric' });
  },

  /**
   * Get relative date string (e.g., "Today", "Tomorrow", "Yesterday")
   * @param {string|Date} date - Date to check
   * @returns {string} Relative date string or formatted date
   */
  getRelativeDate(date) {
    const today = DateCalculations.getToday();
    const checkDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    
    if (checkDate === today) {
      return 'Today';
    }
    
    const tomorrow = DateCalculations.addDays(today, 1);
    if (checkDate === tomorrow) {
      return 'Tomorrow';
    }
    
    const yesterday = DateCalculations.addDays(today, -1);
    if (checkDate === yesterday) {
      return 'Yesterday';
    }
    
    const daysDiff = DateCalculations.daysDifference(today, checkDate);
    if (Math.abs(daysDiff) < 7) {
      const d = new Date(checkDate);
      return d.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    return this.formatDateShort(checkDate);
  }
};

// Default export with all utilities
export default {
  DateCalculations,
  MonthGrid,
  WeekHelpers,
  TimeUtils,
  DateFormatters
};
