package li.pandemic;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.messaging.RemoteMessage;

public class PushModule extends ReactContextBaseJavaModule {

  private static ReactApplicationContext context;

  @NonNull
  @Override
  public String getName() {
    return "PushManager";
  }

  public PushModule(@NonNull ReactApplicationContext reactContext) {
    super(reactContext);

    context = reactContext;
  }

  @ReactMethod
  public void enableDailyReminder(String title, String body) {
    SharedPreferences.Editor editor = context.getSharedPreferences(context.getString(R.string.preferences_key), Context.MODE_PRIVATE).edit();

    editor.putString("daily_reminder__title", title);
    editor.putString("daily_reminder__body", body);

    editor.commit();

    DailyReminderReceiver.setupReminder();
  }

  @ReactMethod
  public void disableDailyReminder() {
    DailyReminderReceiver.cancelReminder();
  }
}
