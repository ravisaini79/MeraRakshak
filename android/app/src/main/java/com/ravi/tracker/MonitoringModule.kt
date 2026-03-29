package com.ravi.tracker

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter
import androidx.core.content.ContextCompat
import android.util.Log

class MonitoringModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    init {
        val filter = IntentFilter("com.ravi.tracker.LOCK_FAILED")
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                sendEvent("onLockFailure", Arguments.createMap())
            }
        }
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            reactContext.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            reactContext.registerReceiver(receiver, filter)
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    companion object {
        var masterPin: String = ""
    }

    override fun getName(): String = "MonitoringModule"

    @ReactMethod
    fun setMasterPin(pin: String) {
        masterPin = pin
    }

    @ReactMethod
    fun startMonitoring(protectedApps: ReadableArray) {
        val context = reactApplicationContext
        val intent = Intent(context, AppMonitoringService::class.java)
        
        val appsList = mutableListOf<String>()
        for (i in 0 until protectedApps.size()) {
            appsList.add(protectedApps.getString(i))
        }
        
        intent.putExtra("protectedApps", appsList.toTypedArray())
        context.startService(intent)
    }

    @ReactMethod
    fun stopMonitoring() {
        val context = reactApplicationContext
        val intent = Intent(context, AppMonitoringService::class.java)
        context.stopService(intent)
    }
}
