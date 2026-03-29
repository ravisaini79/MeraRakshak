package com.ravi.tracker

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class AppMonitoringService : Service() {
    private val handler = Handler()
    private var isRunning = false
    private var protectedApps = mutableSetOf<String>()
    private var lastApp: String? = null

    companion object {
        private const val TAG = "AppMonitoringService"
        private const val CHECK_INTERVAL = 1500L // 1.5 seconds
        private const val CHANNEL_ID = "AppMonitoringChannel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("App Protection Active")
            .setContentText("Monitoring protected applications...")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .build()
        startForeground(1, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val isBoot = intent?.getBooleanExtra("isBoot", false) ?: false
        if (isBoot) {
            Log.d(TAG, "Service started from boot event")
            notifyJs("Device Booted")
        }

        val apps = intent?.getStringArrayExtra("protectedApps")
        if (apps != null) {
            protectedApps = apps.toMutableSet()
            Log.d(TAG, "Monitoring apps: $protectedApps")
        }

        if (!isRunning) {
            isRunning = true
            startMonitoring()
        }

        return START_STICKY
    }

    private fun startMonitoring() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                if (!isRunning) return
                
                val currentApp = getForegroundApp()
                if (currentApp != null && currentApp != lastApp && protectedApps.contains(currentApp)) {
                    Log.d(TAG, "Protected app detected: $currentApp")
                    lastApp = currentApp
                    
                    // Trigger Lock Screen
                    val lockIntent = Intent(this@AppMonitoringService, LockActivity::class.java)
                    lockIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    lockIntent.putExtra("appName", currentApp)
                    lockIntent.putExtra("masterPin", MonitoringModule.masterPin)
                    startActivity(lockIntent)
                    
                    notifyJs(currentApp)
                } else if (currentApp != lastApp) {
                    lastApp = currentApp
                }
                
                handler.postDelayed(this, CHECK_INTERVAL)
            }
        }, CHECK_INTERVAL)
    }

    private fun getForegroundApp(): String? {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val time = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 5, time)
        
        if (stats != null && stats.isNotEmpty()) {
            var latestStats = stats[0]
            for (stat in stats) {
                if (stat.lastTimeUsed > latestStats.lastTimeUsed) {
                    latestStats = stat
                }
            }
            return latestStats.packageName
        }
        return null
    }

    private fun notifyJs(packageName: String) {
        val intent = Intent("com.ravi.tracker.APP_OPEN_EVENT")
        intent.putExtra("packageName", packageName)
        sendBroadcast(intent)
        
        // Also try to send through React Context if available
        try {
            val reactContext = (application as MainApplication).reactNativeHost.reactInstanceManager.currentReactContext
            if (reactContext != null) {
                val params = Arguments.createMap()
                params.putString("packageName", packageName)
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onProtectedAppOpen", params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to emit event to JS: ${e.message}")
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "App Monitoring Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        isRunning = false
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }
}
