package com.strawberryfrappe;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.view.accessibility.AccessibilityEvent;

import java.util.HashSet;
import java.util.Set;

/**
 * Accessibility Service for detecting and blocking specified apps
 * Monitors app launches and automatically closes blocked apps during active sessions
 */
public class AppBlockingAccessibilityService extends AccessibilityService {
    private static final String PREFS_NAME = "app_blocking_prefs";
    private static final String KEY_BLOCKED_APPS = "blocked_apps";
    private static final String KEY_BLOCKING_END_TIME = "blocking_end_time";
    
    private Handler handler = new Handler();
    private Set<String> blockedApps = new HashSet<>();
    private long blockingEndTime = 0;

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            String packageName = event.getPackageName() != null ? event.getPackageName().toString() : "";
            
            // Check if blocking is still active
            if (!isBlockingActive()) {
                return;
            }
            
            // Reload blocked apps list (in case it was updated)
            loadBlockedApps();
            
            // Check if the opened app should be blocked
            if (blockedApps.contains(packageName)) {
                // Send blocking attempt event to React Native
                AppBlockingModule.sendBlockingAttemptEvent(packageName);
                
                // Close the app by simulating home button press
                performGlobalAction(GLOBAL_ACTION_HOME);
            }
        }
    }

    @Override
    public void onInterrupt() {
        // Called when the service is interrupted
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        
        // Configure the accessibility service
        AccessibilityServiceInfo config = new AccessibilityServiceInfo();
        config.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED;
        config.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        config.flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS;
        config.notificationTimeout = 100;
        
        setServiceInfo(config);
        
        // Load initial configuration
        loadBlockedApps();
        loadBlockingEndTime();
    }

    /**
     * Check if blocking session is currently active
     */
    private boolean isBlockingActive() {
        // Always reload end time to ensure we have the latest value
        loadBlockingEndTime();
        
        // If no end time is set, blocking is not active
        if (blockingEndTime <= 0) {
            return false;
        }
        
        // Check if current time has passed the end time
        long currentTime = System.currentTimeMillis();
        boolean isActive = blockingEndTime > currentTime;
        
        // If blocking has expired, clear the data
        if (!isActive) {
            clearBlockingData();
        }
        
        return isActive;
    }

    /**
     * Load blocked apps list from shared preferences
     */
    private void loadBlockedApps() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        blockedApps = prefs.getStringSet(KEY_BLOCKED_APPS, new HashSet<>());
        if (blockedApps == null) {
            blockedApps = new HashSet<>();
        }
    }

    /**
     * Load blocking end time from shared preferences
     */
    private void loadBlockingEndTime() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        blockingEndTime = prefs.getLong(KEY_BLOCKING_END_TIME, 0);
    }

    /**
     * Clear blocking data when session expires
     */
    private void clearBlockingData() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();
        blockingEndTime = 0;
        blockedApps.clear();
    }
}
