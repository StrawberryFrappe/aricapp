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
}

const { AppBlocking } = NativeModules;

export default AppBlocking as AppBlockingInterface;

// Default blocked apps (Facebook and Instagram)
export const DEFAULT_BLOCKED_APPS = [
  'com.facebook.katana',      // Facebook
  'com.instagram.android',  // Instagram
  'com.google.android.youtube', // YouTube
];

// Additional commonly blocked social apps
export const ADDITIONAL_BLOCKED_APPS = [
  'com.twitter.android',      // Twitter
  'com.snapchat.android',     // Snapchat
  'com.zhiliaoapp.musically', // TikTok
  'com.reddit.frontpage',     // Reddit
  'com.discord',              // Discord
  'com.whatsapp',             // WhatsApp
];
