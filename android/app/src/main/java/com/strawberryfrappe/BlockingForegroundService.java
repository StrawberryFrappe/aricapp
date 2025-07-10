package com.strawberryfrappe;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

/**
 * Foreground service to maintain app blocking state in background
 * Ensures blocking continues even when main app is closed or device sleeps
 */
public class BlockingForegroundService extends Service {
    private static final String CHANNEL_ID = "app_blocking_channel";
    private static final int NOTIFICATION_ID = 1001;
    private static final String PREFS_NAME = "app_blocking_prefs";
    private static final String KEY_BLOCKING_END_TIME = "blocking_end_time";
    
    private Handler handler = new Handler();
    private Runnable endBlockingRunnable;
    private Runnable notificationUpdateRunnable;
    private long endTime = 0;
    private int durationMinutes = 0;

    // Binder for local service communication
    private final IBinder binder = new LocalBinder();

    public class LocalBinder extends Binder {
        BlockingForegroundService getService() {
            return BlockingForegroundService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            durationMinutes = intent.getIntExtra("duration_minutes", 0);
            endTime = intent.getLongExtra("end_time", 0);
            
            // Start foreground with notification
            startForeground(NOTIFICATION_ID, createNotification());
            
            // Schedule automatic stop when timer ends
            scheduleAutoStop();
            
            // Start periodic notification updates
            startNotificationUpdates();
        }
        
        // Service should restart if killed
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (endBlockingRunnable != null) {
            handler.removeCallbacks(endBlockingRunnable);
        }
        if (notificationUpdateRunnable != null) {
            handler.removeCallbacks(notificationUpdateRunnable);
        }
        clearBlockingData();
    }

    /**
     * Create notification channel for Android O and above
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "App Blocking",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Maintains app blocking during focus sessions");
            channel.setShowBadge(false);
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * Create persistent notification for foreground service
     */
    private Notification createNotification() {
        // Intent to open main app when notification is tapped
        Intent notificationIntent = new Intent(this, com.strawberryfrappe.aricapp.MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        long remainingTime = Math.max(0, endTime - System.currentTimeMillis());
        
        String contentText;
        if (remainingTime <= 0) {
            contentText = "Focus session ending...";
        } else {
            int totalSeconds = (int) (remainingTime / 1000);
            int hours = totalSeconds / 3600;
            int minutes = (totalSeconds % 3600) / 60;
            int seconds = totalSeconds % 60;
            
            if (hours > 0) {
                contentText = String.format("Focus session active - %dh %dm remaining", hours, minutes);
            } else if (minutes > 0) {
                contentText = String.format("Focus session active - %dm %ds remaining", minutes, seconds);
            } else {
                contentText = String.format("Focus session active - %ds remaining", seconds);
            }
        }

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("🧘 Focus Mode Active")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm) // Using system icon
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build();
    }

    /**
     * Schedule automatic service stop when blocking timer ends
     */
    private void scheduleAutoStop() {
        if (endBlockingRunnable != null) {
            handler.removeCallbacks(endBlockingRunnable);
        }
        
        long delay = endTime - System.currentTimeMillis();
        if (delay > 0) {
            endBlockingRunnable = new Runnable() {
                @Override
                public void run() {
                    // Clear blocking data before stopping service
                    clearBlockingData();
                    stopSelf();
                }
            };
            handler.postDelayed(endBlockingRunnable, delay);
        } else {
            // Timer already ended, stop immediately
            clearBlockingData();
            stopSelf();
        }
    }

    /**
     * Start periodic notification updates to show remaining time
     */
    private void startNotificationUpdates() {
        if (notificationUpdateRunnable != null) {
            handler.removeCallbacks(notificationUpdateRunnable);
        }
        
        notificationUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                // Check if timer has ended
                if (endTime <= System.currentTimeMillis()) {
                    // Timer ended, clear data and stop service
                    clearBlockingData();
                    stopSelf();
                    return;
                }
                
                // Update notification with current remaining time
                NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (manager != null) {
                    manager.notify(NOTIFICATION_ID, createNotification());
                }
                
                // Schedule next update more frequently for better responsiveness
                long remainingTime = Math.max(0, endTime - System.currentTimeMillis());
                if (remainingTime < 60000) { // Less than 1 minute remaining
                    handler.postDelayed(this, 1000); // Update every second
                } else {
                    handler.postDelayed(this, 5000); // Update every 5 seconds for longer durations
                }
            }
        };
        
        // Start updates immediately
        handler.post(notificationUpdateRunnable);
    }

    /**
     * Get remaining time in milliseconds
     */
    public long getRemainingTime() {
        return Math.max(0, endTime - System.currentTimeMillis());
    }

    /**
     * Check if blocking is currently active
     */
    public boolean isBlockingActive() {
        return endTime > System.currentTimeMillis();
    }

    /**
     * Clear blocking data from shared preferences
     */
    private void clearBlockingData() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();
    }
}
