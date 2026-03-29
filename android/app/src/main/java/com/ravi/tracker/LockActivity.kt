package com.ravi.tracker

import com.ravi.tracker.R
import android.app.Activity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import android.content.Intent

class LockActivity : Activity() {
    private lateinit var pinInput: EditText
    private var correctPin: String = "1234" 

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lock)
        
        val pin = intent.getStringExtra("masterPin")
        if (!pin.isNullOrEmpty()) correctPin = pin

        pinInput = findViewById(R.id.pinInput)
        val btnUnlock = findViewById<Button>(R.id.btnUnlock)
        val tvAppName = findViewById<TextView>(R.id.tvAppName)
        
        val appName = intent.getStringExtra("appName") ?: "Protected App"
        tvAppName.text = appName

        btnUnlock.setOnClickListener {
            val entered = pinInput.text.toString()
            if (entered == correctPin) {
                Toast.makeText(this, "Unlocked", Toast.LENGTH_SHORT).show()
                finish()
            } else {
                Toast.makeText(this, "Wrong PIN", Toast.LENGTH_SHORT).show()
                notifyFailure()
                pinInput.setText("")
            }
        }
    }

    private fun notifyFailure() {
        val intent = Intent("com.ravi.tracker.LOCK_FAILED")
        sendBroadcast(intent)
    }

    override fun onBackPressed() {
        val startMain = Intent(Intent.ACTION_MAIN)
        startMain.addCategory(Intent.CATEGORY_HOME)
        startMain.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(startMain)
    }
}
