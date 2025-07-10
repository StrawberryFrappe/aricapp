import { NativeModules } from 'react-native';

export interface InstalledApp {
  packageName: string;
  appName: string;
  icon: string; // base64 encoded icon
}

interface AppBlockingInterface {
  /**
   * Check if accessibility service is enabled for app blocking
   */
  isAccessibilityEnabled(): Promise<boolean>;

  /**
   * Check if notification permission is granted
   */
  areNotificationsEnabled(): Promise<boolean>;

  /**
   * Open accessibility settings for user to enable the service
   */
  openAccessibilitySettings(): Promise<boolean>;

  /**
   * Start app blocking for specified duration and apps
   * @param durationSeconds - Duration to block apps in seconds
   * @param blockedApps - Array of package names to block
   */
  startBlocking(durationSeconds: number, blockedApps: string[]): Promise<boolean>;

  /**
   * Stop app blocking immediately
   */
  stopBlocking(): void;

  /**
   * Get current blocking status
   */
  getBlockingStatus(): Promise<boolean>;

  /**
   * Get list of installed apps that can be blocked
   */
  getInstalledApps(): Promise<InstalledApp[]>;

  /**
   * Save user's selected apps for blocking
   * @param selectedApps - Array of package names to block during focus sessions
   */
  saveSelectedApps(selectedApps: string[]): Promise<boolean>;

  /**
   * Get user's selected apps for blocking
   */
  getSelectedApps(): Promise<string[]>;

  /**
   * Debug method to check popular apps status
   */
  checkPopularApps(): Promise<any[]>;

  /**
   * Search for apps by name to find actual package names
   */
  findAppsByName(searchName: string): Promise<any[]>;

  /**
   * Find apps by package name keyword
   */
  findAppsByPackageKeyword(keyword: string): Promise<any[]>;

  /**
   * Debug comprehensive app filtering analysis
   */
  debugAppFiltering(): Promise<any>;

  /**
   * Enable blocking attempt callbacks via DeviceEventEmitter
   */
  setBlockingAttemptCallback(): Promise<boolean>;

  /**
   * Disable blocking attempt callbacks
   */
  removeBlockingAttemptCallback(): Promise<boolean>;
}

const { AppBlocking } = NativeModules;

export default AppBlocking as AppBlockingInterface;

// DEPRECATED: All default app constants and fallback logic removed
// App blocking now exclusively uses user-selected apps from AsyncStorage

/**
 * Get user-selected apps for blocking without any fallback to defaults
 * @returns Promise<string[]> Array of package names selected by user, empty if none selected
 */
export const getSelectedAppsStrict = async () => {
  try {
    const apps = await AppBlocking.getSelectedApps();
    return apps || [];
  } catch (error) {
    console.warn('Error getting selected apps:', error);
    return [];
  }
};

/**
 * DEPRECATED: No longer initializes with default apps
 * @deprecated Use getSelectedAppsStrict() instead
 * @returns Promise<string[]> Empty array or user selections only
 */
export const initializeDefaultAppsIfEmpty = async () => {
  console.warn('initializeDefaultAppsIfEmpty is deprecated - use getSelectedAppsStrict()');
  return getSelectedAppsStrict();
};
