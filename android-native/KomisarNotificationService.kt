package ua.komisar.ai

import android.app.Notification
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView

class KomisarNotificationService : NotificationListenerService() {

    private val targetPackages = setOf(
        "com.viber.voip",
        "org.telegram.messenger",
        "org.telegram.messenger.web",
        "com.whatsapp",
        "com.instagram.android",
        "com.google.android.apps.messaging",
        "com.android.mms"
    )

    private val scamTriggers = listOf(
        "6500", "допомога", "виплат", "картку заблоковано", "служба безпеки",
        "olx доставка", "перейдіть за посиланням", "проголосуй", "потрапив у дтп",
        "терміново перекажіть", "cvv", "код з смс", "єпідтримка", "нараховано"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val pkg = sbn?.packageName ?: return
        if (!targetPackages.contains(pkg)) return

        val extras = sbn.notification?.extras ?: return
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        val fullMessage = "$title $text".lowercase()

        val isSuspicious = scamTriggers.any { fullMessage.contains(it) } ||
                Regex("(http|https)://[a-zA-Z0-9.-]+\\.(xyz|top|club|site|online|info|click)").containsMatchIn(fullMessage)

        if (isSuspicious) {
            Handler(Looper.getMainLooper()).post {
                showSixthSenseAlert(title, text)
            }
        }
    }

    private fun showSixthSenseAlert(sender: String, message: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            return
        }

        val wm = getSystemService(WINDOW_SERVICE) as WindowManager
        val banner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#E6B91C1C"))
            setPadding(36, 28, 36, 28)
        }

        val header = TextView(this).apply {
            text = "🛡️ КОМІСАР ШІ: ПІДОЗРА ШАХРАЙСТВА!"
            setTextColor(Color.WHITE)
            textSize = 15f
        }

        val body = TextView(this).apply {
            text = "Від: $sender — «${message.take(70)}...»\nНатисніть, щоб відкрити Суфлер захисту"
            setTextColor(Color.parseColor("#FEE2E2"))
            textSize = 13f
        }

        banner.addView(header)
        banner.addView(body)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP
            y = 80
        }

        banner.setOnClickListener {
            try { wm.removeView(banner) } catch (_: Exception) {}
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                putExtra("scam_text", message)
            }
            if (launchIntent != null) startActivity(launchIntent)
        }

        try {
            wm.addView(banner, params)
            Handler(Looper.getMainLooper()).postDelayed({
                try { wm.removeView(banner) } catch (_: Exception) {}
            }, 8000)
        } catch (_: Exception) {}
    }
}
