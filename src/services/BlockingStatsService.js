/**
 * Blocking Statistics Service
 * 
 * Tracks and manages app blocking statistics including weekly counters.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BLOCKING_STATS: '@blocking_statistics'
};

class BlockingStatsService {
  /**
   * Get current week's start date (Monday)
   */
  static getCurrentWeekStart() {
    const now = new Date();
    const monday = new Date(now);
    const day = now.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1; // Sunday = 0, so 6 days from Monday
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  /**
   * Record a blocking attempt (when user tries to access a blocked app)
   * @param {string} packageName - Package name of the blocked app
   * @param {string} appName - Display name of the blocked app
   */
  static async recordBlockingAttempt(packageName = null, appName = null) {
    try {
      const weekStart = this.getCurrentWeekStart();
      const stats = await this.getStats();
      
      // Initialize week data if it doesn't exist
      if (!stats.weeklyBlocks[weekStart]) {
        stats.weeklyBlocks[weekStart] = 0;
      }
      if (!stats.weeklyAttempts) {
        stats.weeklyAttempts = {};
      }
      if (!stats.weeklyAttempts[weekStart]) {
        stats.weeklyAttempts[weekStart] = [];
      }

      // Record this blocking attempt
      const attemptRecord = {
        timestamp: new Date().toISOString(),
        packageName: packageName || 'unknown',
        appName: appName || 'Unknown App'
      };
      
      stats.weeklyBlocks[weekStart]++;
      stats.totalBlocks++;
      stats.weeklyAttempts[weekStart].push(attemptRecord);
      stats.lastBlockedDate = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEYS.BLOCKING_STATS, JSON.stringify(stats));
      
      console.log(`Blocked attempt to open ${appName || packageName || 'app'}. Weekly total: ${stats.weeklyBlocks[weekStart]}`);
      return stats.weeklyBlocks[weekStart];
    } catch (error) {
      console.error('Error recording blocking attempt:', error);
      return 0;
    }
  }

  /**
   * Get current week's blocking count
   */
  static async getCurrentWeekBlocks() {
    try {
      const weekStart = this.getCurrentWeekStart();
      const stats = await this.getStats();
      return stats.weeklyBlocks[weekStart] || 0;
    } catch (error) {
      console.error('Error getting current week blocks:', error);
      return 0;
    }
  }

  /**
   * Get all blocking statistics
   */
  static async getStats() {
    try {
      const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.BLOCKING_STATS);
      if (!statsJson) {
        return {
          totalBlocks: 0,
          weeklyBlocks: {}, // { 'YYYY-MM-DD': count }
          weeklyAttempts: {}, // { 'YYYY-MM-DD': [attemptRecords] }
          lastBlockedDate: null
        };
      }
      const stats = JSON.parse(statsJson);
      
      // Ensure weeklyAttempts exists for backward compatibility
      if (!stats.weeklyAttempts) {
        stats.weeklyAttempts = {};
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting blocking stats:', error);
      return {
        totalBlocks: 0,
        weeklyBlocks: {},
        weeklyAttempts: {},
        lastBlockedDate: null
      };
    }
  }

  /**
   * Clear old weekly data (keep last 4 weeks)
   */
  static async cleanupOldData() {
    try {
      const stats = await this.getStats();
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const cutoffDate = fourWeeksAgo.toISOString().split('T')[0];
      
      // Filter out weeks older than 4 weeks
      Object.keys(stats.weeklyBlocks).forEach(weekStart => {
        if (weekStart < cutoffDate) {
          delete stats.weeklyBlocks[weekStart];
        }
      });
      
      // Also clean up weeklyAttempts
      Object.keys(stats.weeklyAttempts || {}).forEach(weekStart => {
        if (weekStart < cutoffDate) {
          delete stats.weeklyAttempts[weekStart];
        }
      });
      
      await AsyncStorage.setItem(STORAGE_KEYS.BLOCKING_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error cleaning up old blocking data:', error);
    }
  }

  /**
   * Reset all statistics
   */
  static async resetStats() {
    try {
      const emptyStats = {
        totalBlocks: 0,
        weeklyBlocks: {},
        weeklyAttempts: {},
        lastBlockedDate: null
      };
      await AsyncStorage.setItem(STORAGE_KEYS.BLOCKING_STATS, JSON.stringify(emptyStats));
    } catch (error) {
      console.error('Error resetting blocking stats:', error);
    }
  }

  /**
   * Get detailed statistics for debugging
   */
  static async getDetailedStats() {
    try {
      const stats = await this.getStats();
      const currentWeek = this.getCurrentWeekStart();
      
      return {
        currentWeek,
        currentWeekBlocks: stats.weeklyBlocks[currentWeek] || 0,
        currentWeekAttempts: stats.weeklyAttempts[currentWeek] || [],
        totalBlocks: stats.totalBlocks,
        allWeeklyBlocks: stats.weeklyBlocks,
        lastBlockedDate: stats.lastBlockedDate
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error);
      return null;
    }
  }

  /**
   * Get the most frequently blocked apps this week
   * @param {number} limit - Number of top apps to return
   */
  static async getMostBlockedApps(limit = 5) {
    try {
      const weekStart = this.getCurrentWeekStart();
      const stats = await this.getStats();
      const weeklyAttempts = stats.weeklyAttempts[weekStart] || [];
      
      // Count attempts per app
      const appCounts = {};
      weeklyAttempts.forEach(attempt => {
        const key = attempt.appName || attempt.packageName || 'Unknown';
        appCounts[key] = (appCounts[key] || 0) + 1;
      });
      
      // Sort by count and return top apps
      return Object.entries(appCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([appName, count]) => ({ appName, count }));
    } catch (error) {
      console.error('Error getting most blocked apps:', error);
      return [];
    }
  }
}

export default BlockingStatsService;
