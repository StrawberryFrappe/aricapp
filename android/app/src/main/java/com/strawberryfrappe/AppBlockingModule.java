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
            android.util.Log.d("AppBlocking", "=== Starting getInstalledApps ===");
            
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(PackageManager.GET_META_DATA);
            WritableArray appList = Arguments.createArray();
            
            String currentPackage = reactContext.getPackageName();
            android.util.Log.d("AppBlocking", "Current package (to exclude): " + currentPackage);
            android.util.Log.d("AppBlocking", "Total packages found: " + packages.size());
            
            int processedCount = 0;
            int skippedOwnApp = 0;
            int skippedInvalidNames = 0;
            int skippedSystemApps = 0;
            int addedToList = 0;
            int errorCount = 0;
            
            for (PackageInfo packageInfo : packages) {
                processedCount++;
                String packageName = packageInfo.packageName;
                
                // Skip our own app only
                if (packageName.equals(currentPackage)) {
                    skippedOwnApp++;
                    android.util.Log.d("AppBlocking", "Skipped own app: " + packageName);
                    continue;
                }
                
                try {
                    ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
                    String appName = pm.getApplicationLabel(appInfo).toString();
                    
                    android.util.Log.v("AppBlocking", "Processing: " + packageName + " -> " + appName);
                    
                    // Skip apps with empty or very short names
                    if (appName == null || appName.trim().length() < 2) {
                        skippedInvalidNames++;
                        android.util.Log.v("AppBlocking", "Skipped invalid name: " + packageName + " (name: '" + appName + "')");
                        continue;
                    }
                    
                    // Use comprehensive filtering logic
                    if (shouldFilterApp(packageName, appName, appInfo)) {
                        skippedSystemApps++;
                        android.util.Log.v("AppBlocking", "Filtered out: " + packageName + " (" + appName + ")");
                        continue;
                    }
                    
                    // Only include apps that have launch intents (user-launchable apps)
                    Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                    if (launchIntent == null) {
                        skippedSystemApps++;
                        android.util.Log.v("AppBlocking", "No launch intent: " + packageName + " (" + appName + ")");
                        continue;
                    }
                    
                    // Include user apps and blockable system apps
                    android.util.Log.v("AppBlocking", "Including app: " + packageName + " (" + appName + ")");
                    
                    // Get app icon as base64
                    String iconBase64 = getAppIconBase64(pm, packageName);
                    
                    WritableMap appMap = Arguments.createMap();
                    appMap.putString("packageName", packageName);
                    appMap.putString("appName", appName);
                    appMap.putString("icon", iconBase64);
                    
                    appList.pushMap(appMap);
                    addedToList++;
                    
                    // Log some popular apps if found
                    if (packageName.contains("youtube") || packageName.contains("instagram") || 
                        packageName.contains("discord") || packageName.contains("facebook") ||
                        packageName.contains("twitter") || packageName.contains("snapchat") ||
                        packageName.contains("tiktok") || packageName.contains("musically") ||
                        packageName.contains("reddit") || packageName.contains("whatsapp") ||
                        packageName.contains("spotify") || packageName.contains("netflix") ||
                        packageName.contains("chrome") || packageName.contains("browser")) {
                        android.util.Log.i("AppBlocking", "FOUND POPULAR APP: " + packageName + " (" + appName + ")");
                    }
                    
                } catch (Exception e) {
                    errorCount++;
                    android.util.Log.w("AppBlocking", "Error processing " + packageName + ": " + e.getMessage());
                    continue;
                }
            }
            
            android.util.Log.d("AppBlocking", "=== getInstalledApps Summary ===");
            android.util.Log.d("AppBlocking", "Total processed: " + processedCount);
            android.util.Log.d("AppBlocking", "Skipped own app: " + skippedOwnApp);
            android.util.Log.d("AppBlocking", "Skipped invalid names: " + skippedInvalidNames);
            android.util.Log.d("AppBlocking", "Skipped system apps: " + skippedSystemApps);
            android.util.Log.d("AppBlocking", "Processing errors: " + errorCount);
            android.util.Log.d("AppBlocking", "Added to list: " + addedToList);
            android.util.Log.d("AppBlocking", "Final app list size: " + appList.size());
            
            promise.resolve(appList);
        } catch (Exception e) {
            android.util.Log.e("AppBlocking", "getInstalledApps failed: " + e.getMessage(), e);
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
                    appInfo.putBoolean("wouldBeFiltered", shouldFilterApp(packageName, appName, appInfo_detail));
                    
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
                        result.putBoolean("wouldBeFiltered", shouldFilterApp(packageName, appName, appInfo));
                        
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
                        result.putBoolean("wouldBeFiltered", shouldFilterApp(packageName, appName, appInfo));
                        
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
     * Comprehensive debug method to analyze all installed apps and filtering
     */
    @ReactMethod
    public void debugAppFiltering(Promise promise) {
        try {
            android.util.Log.d("AppBlocking", "=== DEBUG APP FILTERING ===");
            
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(PackageManager.GET_META_DATA);
            WritableArray debugResults = Arguments.createArray();
            
            String currentPackage = reactContext.getPackageName();
            android.util.Log.d("AppBlocking", "Current package: " + currentPackage);
            android.util.Log.d("AppBlocking", "Total packages: " + packages.size());
            
            int totalApps = 0;
            int userApps = 0;
            int systemApps = 0;
            int phoneSystemApps = 0;
            int validNameApps = 0;
            int finalIncluded = 0;
            
            for (PackageInfo packageInfo : packages) {
                totalApps++;
                String packageName = packageInfo.packageName;
                
                try {
                    ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
                    String appName = pm.getApplicationLabel(appInfo).toString();
                    boolean isSystemApp = (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                    boolean shouldFilter = shouldFilterApp(packageName, appName, appInfo);
                    boolean hasValidName = appName != null && appName.trim().length() >= 2;
                    boolean isOwnApp = packageName.equals(currentPackage);
                    Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                    boolean hasLaunchIntent = launchIntent != null;
                    
                    if (isSystemApp) systemApps++;
                    else userApps++;
                    
                    if (shouldFilter) phoneSystemApps++;
                    if (hasValidName) validNameApps++;
                    
                    // Current filtering logic - matches the updated getInstalledApps logic
                    boolean shouldInclude = !isOwnApp && hasValidName && !shouldFilter && hasLaunchIntent;
                    if (shouldInclude) finalIncluded++;
                    
                    // Log popular apps specifically
                    if (packageName.contains("youtube") || packageName.contains("instagram") || 
                        packageName.contains("discord") || packageName.contains("facebook") ||
                        packageName.contains("twitter") || packageName.contains("snapchat") ||
                        packageName.contains("tiktok") || packageName.contains("musically") ||
                        packageName.contains("reddit") || packageName.contains("whatsapp") ||
                        packageName.contains("spotify") || packageName.contains("netflix")) {
                        
                        android.util.Log.i("AppBlocking", String.format(
                            "POPULAR APP: %s (%s) - System:%b, Filtered:%b, ValidName:%b, Launch:%b, Include:%b",
                            packageName, appName, isSystemApp, shouldFilter, hasValidName, hasLaunchIntent, shouldInclude
                        ));
                        
                        WritableMap debugApp = Arguments.createMap();
                        debugApp.putString("packageName", packageName);
                        debugApp.putString("appName", appName);
                        debugApp.putBoolean("isSystemApp", isSystemApp);
                        debugApp.putBoolean("isFiltered", shouldFilter);
                        debugApp.putBoolean("hasValidName", hasValidName);
                        debugApp.putBoolean("hasLaunchIntent", hasLaunchIntent);
                        debugApp.putBoolean("shouldInclude", shouldInclude);
                        debugApp.putBoolean("isOwnApp", isOwnApp);
                        debugResults.pushMap(debugApp);
                    }
                    
                } catch (Exception e) {
                    android.util.Log.w("AppBlocking", "Error processing " + packageName + ": " + e.getMessage());
                }
            }
            
            android.util.Log.d("AppBlocking", "=== FILTERING SUMMARY ===");
            android.util.Log.d("AppBlocking", "Total apps: " + totalApps);
            android.util.Log.d("AppBlocking", "User apps: " + userApps);
            android.util.Log.d("AppBlocking", "System apps: " + systemApps);
            android.util.Log.d("AppBlocking", "Filtered apps: " + phoneSystemApps);
            android.util.Log.d("AppBlocking", "Valid name apps: " + validNameApps);
            android.util.Log.d("AppBlocking", "Final included: " + finalIncluded);
            
            WritableMap summary = Arguments.createMap();
            summary.putInt("totalApps", totalApps);
            summary.putInt("userApps", userApps);
            summary.putInt("systemApps", systemApps);
            summary.putInt("filteredApps", phoneSystemApps);
            summary.putInt("validNameApps", validNameApps);
            summary.putInt("finalIncluded", finalIncluded);
            summary.putArray("popularApps", debugResults);
            
            promise.resolve(summary);
        } catch (Exception e) {
            android.util.Log.e("AppBlocking", "Debug filtering failed: " + e.getMessage(), e);
            promise.reject("DEBUG_ERROR", e.getMessage());
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
     * Check if an app should be filtered out from the blocking list
     * NEW APPROACH: Only include user-installed apps to dramatically improve performance
     */
    private boolean shouldFilterApp(String packageName, String appName, ApplicationInfo appInfo) {
        // Check if it's a system app
        boolean isSystemApp = (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
        
        // Get launch intent to check if app is user-launchable
        PackageManager pm = reactContext.getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
        boolean hasLaunchIntent = launchIntent != null;
        
        // RESTRICTIVE APPROACH: Filter out ALL system apps except for a few user-facing ones
        // This dramatically reduces the list from ~248 apps to ~20-50 user apps
        
        if (isSystemApp) {
            // Allow only specific well-known system apps that users might want to block
            String[] allowedSystemApps = {
                "com.android.chrome",           // Chrome browser
                "com.google.android.youtube",   // YouTube (if system)
                "com.android.vending",          // Google Play Store
                "com.google.android.apps.docs", // Google Drive
                "com.google.android.gm",        // Gmail
                "com.google.android.apps.maps", // Google Maps
                "com.google.android.calendar",  // Google Calendar
                "com.google.android.apps.photos", // Google Photos
                "com.samsung.android.calendar", // Samsung Calendar
                "com.sec.android.app.camera",   // Samsung Camera
                "com.samsung.android.video",    // Samsung Video Player
                "com.sec.android.app.myfiles",  // Samsung My Files
                "com.samsung.android.game.gamehome", // Samsung Gaming Hub
                "com.samsung.android.game.gametools", // Samsung Game Booster
                "com.sec.android.app.sbrowser", // Samsung Internet
                "com.samsung.android.forest",   // Samsung Digital Wellbeing
                "com.sec.android.app.clockpackage", // Samsung Clock
                "com.sec.android.app.fm",       // Samsung Radio
                "com.google.android.documentsui", // Files app
                "com.samsung.android.lool",     // Samsung Device care
            };
            
            boolean isAllowedSystemApp = false;
            for (String allowedApp : allowedSystemApps) {
                if (packageName.equals(allowedApp)) {
                    isAllowedSystemApp = true;
                    break;
                }
            }
            
            // Filter out ALL system apps unless they're in the allowed list
            if (!isAllowedSystemApp) {
                return true; // Filter out
            }
        }
        
        // Must have a launch intent (user-launchable)
        if (!hasLaunchIntent) {
            return true; // Filter out
        }
        
        // Filter out apps with very short or invalid names
        if (appName == null || appName.trim().length() < 2) {
            return true; // Filter out
        }
        
        // Filter out apps with system-like names even if they're not flagged as system apps
        String lowerAppName = appName.toLowerCase();
        if (lowerAppName.contains("test") || lowerAppName.contains("debug") ||
            lowerAppName.contains("demo") || lowerAppName.contains("sample") ||
            lowerAppName.startsWith("com.") || lowerAppName.contains("framework") ||
            (lowerAppName.contains("service") && lowerAppName.length() < 20)) {
            return true; // Filter out
        }
        
        return false; // Include in list - this is a user app worth blocking
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
