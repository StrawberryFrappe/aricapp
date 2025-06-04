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
  
  if (!ShizukuModule) {
    return Promise.reject(new Error('ShizukuModule is not available. Make sure the native module is properly linked.'));
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
  
  if (!ShizukuModule) {
    return Promise.reject(new Error('ShizukuModule is not available. Make sure the native module is properly linked.'));
  }
  
  return ShizukuModule.forceStopApp(packageName);
}
