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
   * Record a blocking event
   */
  static async recordBlockingEvent() {
    try {
      const weekStart = this.getCurrentWeekStart();
      const stats = await this.getStats();
      
      if (!stats.weeklyBlocks[weekStart]) {
        stats.weeklyBlocks[weekStart] = 0;
      }
      
      stats.weeklyBlocks[weekStart]++;
      stats.totalBlocks++;
      stats.lastBlockedDate = new Date().toISOString();
      
      await AsyncStorage.setItem(STORAGE_KEYS.BLOCKING_STATS, JSON.stringify(stats));
      
      return stats.weeklyBlocks[weekStart];
    } catch (error) {
      console.error('Error recording blocking event:', error);
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
          lastBlockedDate: null
        };
      }
      return JSON.parse(statsJson);
    } catch (error) {
      console.error('Error getting blocking stats:', error);
      return {
        totalBlocks: 0,
        weeklyBlocks: {},
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
        lastBlockedDate: null
      };
      await AsyncStorage.setItem(STORAGE_KEYS.BLOCKING_STATS, JSON.stringify(emptyStats));
    } catch (error) {
      console.error('Error resetting blocking stats:', error);
    }
  }
}

export default BlockingStatsService;
