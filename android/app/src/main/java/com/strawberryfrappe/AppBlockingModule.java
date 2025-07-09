package com.strawberryfrappe;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.ByteArrayOutputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Native module bridge for app blocking functionality
 * Manages communication between React Native and Android native services
 */
public class AppBlockingModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "AppBlocking";
    private static final String PREFS_NAME = "app_blocking_prefs";
    private static final String KEY_BLOCKED_APPS = "blocked_apps";
    private static final String KEY_BLOCKING_END_TIME = "blocking_end_time";
    private static final String KEY_SELECTED_APPS = "selected_apps_for_blocking";
    
    private ReactApplicationContext reactContext;
    private BlockingForegroundService boundService;
    private boolean serviceBound = false;

    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            BlockingForegroundService.LocalBinder binder = (BlockingForegroundService.LocalBinder) service;
            boundService = binder.getService();
            serviceBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            boundService = null;
            serviceBound = false;
        }
    };

    public AppBlockingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Check if accessibility service is enabled for this app
     */
    @ReactMethod
    public void isAccessibilityEnabled(Promise promise) {
        try {
            boolean enabled = isAccessibilityServiceEnabled();
            promise.resolve(enabled);
        } catch (Exception e) {
            promise.reject("ACCESSIBILITY_CHECK_ERROR", e.getMessage());
        }
    }

    /**
     * Open accessibility settings for user to enable the service
     */
    @ReactMethod
    public void openAccessibilitySettings(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("OPEN_SETTINGS_ERROR", e.getMessage());
        }
    }

    /**
     * Check if notification permission is granted
     */
    @ReactMethod
    public void areNotificationsEnabled(Promise promise) {
        try {
            boolean enabled = NotificationManagerCompat.from(reactContext).areNotificationsEnabled();
            promise.resolve(enabled);
        } catch (Exception e) {
            promise.reject("NOTIFICATION_CHECK_ERROR", e.getMessage());
        }
    }

    /**
     * Start app blocking for specified duration and apps
     */
    @ReactMethod
    public void startBlocking(int durationSeconds, ReadableArray blockedApps, Promise promise) {
        try {
            if (!isAccessibilityServiceEnabled()) {
                promise.reject("ACCESSIBILITY_DISABLED", "Accessibility service not enabled");
                return;
            }

            // Check notification permission and log warning if not granted
            if (!NotificationManagerCompat.from(reactContext).areNotificationsEnabled()) {
                android.util.Log.w("AppBlocking", "Notification permission not granted - progress notifications will not be visible");
            }

            // Convert ReadableArray to Set<String>
            Set<String> appPackages = new HashSet<>();
            for (int i = 0; i < blockedApps.size(); i++) {
                appPackages.add(blockedApps.getString(i));
            }

            // Save blocked apps list
            saveBlockedApps(appPackages);
            
            // Calculate end time using seconds
            long endTime = System.currentTimeMillis() + (durationSeconds * 1000L);
            saveBlockingEndTime(endTime);

            // Start foreground service
            Intent serviceIntent = new Intent(reactContext, BlockingForegroundService.class);
            serviceIntent.putExtra("duration_minutes", (int) Math.ceil(durationSeconds / 60.0)); // For notification display
            serviceIntent.putExtra("end_time", endTime);
            reactContext.startForegroundService(serviceIntent);

            // Bind to service for communication
            Intent bindIntent = new Intent(reactContext, BlockingForegroundService.class);
            reactContext.bindService(bindIntent, serviceConnection, Context.BIND_AUTO_CREATE);

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("START_BLOCKING_ERROR", e.getMessage());
        }
    }

    /**
     * Stop app blocking immediately
     */
    @ReactMethod
    public void stopBlocking() {
        try {
            // Clear stored data
            clearBlockingData();
            
            // Stop foreground service
            Intent serviceIntent = new Intent(reactContext, BlockingForegroundService.class);
            reactContext.stopService(serviceIntent);
            
            // Unbind service
            if (serviceBound) {
                reactContext.unbindService(serviceConnection);
                serviceBound = false;
            }
        } catch (Exception e) {
            // Log error but don't throw - stopping should always succeed
        }
    }

    /**
     * Get current blocking status
     */
    @ReactMethod
    public void getBlockingStatus(Promise promise) {
        try {
            long endTime = getBlockingEndTime();
            boolean isActive = endTime > System.currentTimeMillis();
            promise.resolve(isActive);
        } catch (Exception e) {
            promise.reject("STATUS_CHECK_ERROR", e.getMessage());
        }
    }

    /**
     * Get list of installed apps that can be blocked
     */
    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(PackageManager.GET_META_DATA);
            WritableArray appList = Arguments.createArray();
            
            String currentPackage = reactContext.getPackageName();
            
            for (PackageInfo packageInfo : packages) {
                // Skip our own app
                if (packageInfo.packageName.equals(currentPackage)) {
                    continue;
                }
                
                try {
                    ApplicationInfo appInfo = pm.getApplicationInfo(packageInfo.packageName, 0);
                    String appName = pm.getApplicationLabel(appInfo).toString();
                    
                    // Skip apps with empty or very short names
                    if (appName == null || appName.trim().length() < 2) {
                        continue;
                    }
                    
                    // Skip phone-specific system apps that shouldn't be blocked
                    if (isPhoneSystemApp(packageInfo.packageName, appName)) {
                        continue;
                    }
                    
                    // For non-system apps, check if they have a launch intent
                    // For system apps, be more permissive (some useful apps might not have main launch intents)
                    boolean isSystemApp = (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                    if (!isSystemApp) {
                        Intent launchIntent = pm.getLaunchIntentForPackage(packageInfo.packageName);
                        if (launchIntent == null) {
                            // Log popular apps that are being filtered out
                            if (packageInfo.packageName.contains("youtube") || 
                                packageInfo.packageName.contains("instagram") || 
                                packageInfo.packageName.contains("discord") ||
                                packageInfo.packageName.contains("facebook") ||
                                packageInfo.packageName.contains("twitter")) {
                                android.util.Log.d("AppBlocking", "Excluding popular app (no launch intent): " + appName + " (" + packageInfo.packageName + ")");
                            }
                            continue;
                        }
                    }
                    
                    // Get app icon as base64
                    String iconBase64 = getAppIconBase64(pm, packageInfo.packageName);
                    
                    WritableMap appMap = Arguments.createMap();
                    appMap.putString("packageName", packageInfo.packageName);
                    appMap.putString("appName", appName);
                    appMap.putString("icon", iconBase64);
                    
                    // Log popular apps being included
                    if (packageInfo.packageName.contains("youtube") || 
                        packageInfo.packageName.contains("instagram") || 
                        packageInfo.packageName.contains("discord") ||
                        packageInfo.packageName.contains("facebook") ||
                        packageInfo.packageName.contains("twitter")) {
                        android.util.Log.d("AppBlocking", "Including popular app: " + appName + " (" + packageInfo.packageName + ")");
                    }
                    
                    appList.pushMap(appMap);
                } catch (Exception e) {
                    // Skip apps that can't be processed
                    continue;
                }
            }
            
            promise.resolve(appList);
        } catch (Exception e) {
            promise.reject("GET_APPS_ERROR", e.getMessage());
        }
    }

    /**
     * Save user's selected apps for blocking
     */
    @ReactMethod
    public void saveSelectedApps(ReadableArray selectedApps, Promise promise) {
        try {
            Set<String> appsSet = new HashSet<>();
            for (int i = 0; i < selectedApps.size(); i++) {
                appsSet.add(selectedApps.getString(i));
            }
            
            SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().putStringSet(KEY_SELECTED_APPS, appsSet).apply();
            
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SAVE_APPS_ERROR", e.getMessage());
        }
    }

    /**
     * Get user's selected apps for blocking
     */
    @ReactMethod
    public void getSelectedApps(Promise promise) {
        try {
            SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            Set<String> selectedApps = prefs.getStringSet(KEY_SELECTED_APPS, new HashSet<>());
            
            WritableArray appArray = Arguments.createArray();
            for (String packageName : selectedApps) {
                appArray.pushString(packageName);
            }
            
            promise.resolve(appArray);
        } catch (Exception e) {
            promise.reject("GET_SELECTED_APPS_ERROR", e.getMessage());
        }
    }

    /**
     * Debug method to check specific popular apps
     */
    @ReactMethod
    public void checkPopularApps(Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            WritableArray debugInfo = Arguments.createArray();
            
            String[] popularApps = {
                "com.google.android.youtube",
                "com.instagram.android", 
                "com.discord",
                "com.facebook.katana",
                "com.twitter.android",
                "com.snapchat.android",
                "com.zhiliaoapp.musically", // TikTok
                "com.reddit.frontpage"
            };
            
            for (String packageName : popularApps) {
                WritableMap appInfo = Arguments.createMap();
                appInfo.putString("packageName", packageName);
                
                try {
                    PackageInfo packageInfo = pm.getPackageInfo(packageName, 0);
                    ApplicationInfo appInfo_detail = pm.getApplicationInfo(packageName, 0);
                    String appName = pm.getApplicationLabel(appInfo_detail).toString();
                    Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                    boolean isSystemApp = (appInfo_detail.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                    
                    appInfo.putString("appName", appName);
                    appInfo.putBoolean("isInstalled", true);
                    appInfo.putBoolean("hasLaunchIntent", launchIntent != null);
                    appInfo.putBoolean("isSystemApp", isSystemApp);
                    appInfo.putBoolean("wouldBeFiltered", isPhoneSystemApp(packageName, appName));
                    
                } catch (PackageManager.NameNotFoundException e) {
                    appInfo.putBoolean("isInstalled", false);
                    appInfo.putString("appName", "Not installed");
                }
                
                debugInfo.pushMap(appInfo);
            }
            
            promise.resolve(debugInfo);
        } catch (Exception e) {
            promise.reject("DEBUG_ERROR", e.getMessage());
        }
    }

    /**
     * Search for apps by name to find actual package names
     */
    @ReactMethod
    public void findAppsByName(String searchName, Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            WritableArray results = Arguments.createArray();
            
            List<ApplicationInfo> allApps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            
            for (ApplicationInfo appInfo : allApps) {
                try {
                    String appName = pm.getApplicationLabel(appInfo).toString();
                    String packageName = appInfo.packageName;
                    
                    // Search by name (case insensitive)
                    if (appName.toLowerCase().contains(searchName.toLowerCase())) {
                        WritableMap result = Arguments.createMap();
                        result.putString("packageName", packageName);
                        result.putString("appName", appName);
                        
                        Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                        boolean isSystemApp = (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                        
                        result.putBoolean("hasLaunchIntent", launchIntent != null);
                        result.putBoolean("isSystemApp", isSystemApp);
                        result.putBoolean("wouldBeFiltered", isPhoneSystemApp(packageName, appName));
                        
                        results.pushMap(result);
                    }
                } catch (Exception e) {
                    // Skip apps that can't be processed
                    continue;
                }
            }
            
            promise.resolve(results);
        } catch (Exception e) {
            promise.reject("SEARCH_ERROR", e.getMessage());
        }
    }

    /**
     * Get all apps that contain specific keywords in their package names
     */
    @ReactMethod
    public void findAppsByPackageKeyword(String keyword, Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            WritableArray results = Arguments.createArray();
            
            List<ApplicationInfo> allApps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            
            for (ApplicationInfo appInfo : allApps) {
                try {
                    String packageName = appInfo.packageName;
                    
                    // Search by package name (case insensitive)
                    if (packageName.toLowerCase().contains(keyword.toLowerCase())) {
                        String appName = pm.getApplicationLabel(appInfo).toString();
                        
                        WritableMap result = Arguments.createMap();
                        result.putString("packageName", packageName);
                        result.putString("appName", appName);
                        
                        Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                        boolean isSystemApp = (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                        
                        result.putBoolean("hasLaunchIntent", launchIntent != null);
                        result.putBoolean("isSystemApp", isSystemApp);
                        result.putBoolean("wouldBeFiltered", isPhoneSystemApp(packageName, appName));
                        
                        results.pushMap(result);
                    }
                } catch (Exception e) {
                    // Skip apps that can't be processed
                    continue;
                }
            }
            
            promise.resolve(results);
        } catch (Exception e) {
            promise.reject("SEARCH_ERROR", e.getMessage());
        }
    }

    private boolean isAccessibilityServiceEnabled() {
        String settingValue = Settings.Secure.getString(
            reactContext.getContentResolver(),
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        
        if (settingValue != null) {
            TextUtils.SimpleStringSplitter splitter = new TextUtils.SimpleStringSplitter(':');
            splitter.setString(settingValue);
            while (splitter.hasNext()) {
                String service = splitter.next();
                if (service.equalsIgnoreCase(reactContext.getPackageName() + "/" + AppBlockingAccessibilityService.class.getName())) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if an app is a system app
     */
    private boolean isSystemApp(PackageInfo packageInfo) {
        return (packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
    }

    /**
     * Check if an app is a phone-specific system app that shouldn't be blocked
     */
    private boolean isPhoneSystemApp(String packageName, String appName) {
        // Common phone system apps that should be excluded
        String[] phoneSystemPackages = {
            "com.android.dialer",           // Phone/Dialer
            "com.android.contacts",         // Contacts
            "com.android.mms",              // Messages/SMS
            "com.android.messaging",        // Messages
            "com.google.android.dialer",    // Google Dialer
            "com.google.android.contacts",  // Google Contacts
            "com.samsung.android.dialer",   // Samsung Dialer
            "com.samsung.android.messaging",// Samsung Messages
            "com.samsung.android.contacts", // Samsung Contacts
            "com.samsung.android.gallery3d",// Samsung Gallery
            "com.sec.android.gallery3d",    // Samsung Gallery (alternative)
            "com.android.emergency",        // Emergency
            "com.android.phone",            // Phone service
            "com.android.stk",              // SIM Toolkit
            "com.android.settings",         // System Settings
            "com.samsung.android.settings", // Samsung Settings
            "com.android.systemui",         // System UI
            "com.android.launcher",         // System Launcher
            "com.android.launcher3",        // Launcher3
            "com.samsung.android.launcher", // Samsung Launcher
            "com.google.android.setupwizard", // Setup Wizard
            "com.android.provision",        // Setup/Provision
            "com.android.inputmethod",      // Input methods
            "com.samsung.android.inputmethod", // Samsung Keyboard
            "com.google.android.inputmethod",  // Google Keyboard
        };
        
        // Check against package name patterns
        for (String systemPackage : phoneSystemPackages) {
            if (packageName.equals(systemPackage) || packageName.startsWith(systemPackage + ".")) {
                return true;
            }
        }
        
        // Additional checks for system-level apps by name
        String lowerAppName = appName.toLowerCase();
        String[] systemAppNames = {
            "phone", "dialer", "call", "contacts", "messages", "messaging", 
            "sms", "settings", "launcher", "emergency", "setup", "provision",
            "keyboard", "input method", "system ui", "gallery"
        };
        
        for (String systemName : systemAppNames) {
            if (lowerAppName.equals(systemName) || 
                (lowerAppName.startsWith(systemName + " ") || lowerAppName.endsWith(" " + systemName))) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get app icon as base64 encoded string
     */
    private String getAppIconBase64(PackageManager pm, String packageName) {
        try {
            Drawable icon = pm.getApplicationIcon(packageName);
            Bitmap bitmap = drawableToBitmap(icon);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
            byte[] imageBytes = baos.toByteArray();
            
            return Base64.encodeToString(imageBytes, Base64.DEFAULT);
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Convert drawable to bitmap
     */
    private Bitmap drawableToBitmap(Drawable drawable) {
        if (drawable instanceof BitmapDrawable) {
            return ((BitmapDrawable) drawable).getBitmap();
        }

        int width = drawable.getIntrinsicWidth();
        int height = drawable.getIntrinsicHeight();
        
        // Limit icon size to reduce memory usage
        int maxSize = 128;
        if (width > maxSize || height > maxSize) {
            float ratio = Math.min((float) maxSize / width, (float) maxSize / height);
            width = (int) (width * ratio);
            height = (int) (height * ratio);
        }

        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);

        return bitmap;
    }

    private void saveBlockedApps(Set<String> apps) {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putStringSet(KEY_BLOCKED_APPS, apps).apply();
    }

    private void saveBlockingEndTime(long endTime) {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putLong(KEY_BLOCKING_END_TIME, endTime).apply();
    }

    private long getBlockingEndTime() {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getLong(KEY_BLOCKING_END_TIME, 0);
    }

    private void clearBlockingData() {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();
    }
}
