import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
const { ShizukuModule } = NativeModules;

/**
 * Initialize Shizuku: auto-start on root, or request user permission.
 * @returns {Promise<boolean>}
 */
export function initializeShizuku() {
  if (Platform.OS !== 'android') {
    return Promise.reject(new Error('Shizuku is only supported on Android'));
  }
  return ShizukuModule.initialize();
}

/**
 * Force-stop the given package name via Shizuku.
 * @param {string} packageName
 * @returns {Promise<void>}
 */
export function forceStopApp(packageName) {
  if (Platform.OS !== 'android') {
    return Promise.reject(new Error('Shizuku is only supported on Android'));
  }
  return ShizukuModule.forceStopApp(packageName);
}
