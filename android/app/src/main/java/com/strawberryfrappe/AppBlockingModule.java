package com.strawberryfrappe;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.HashSet;
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
