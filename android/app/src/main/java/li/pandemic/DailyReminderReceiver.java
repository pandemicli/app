package li.pandemic;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import java.util.Calendar;

public class DailyReminderReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    SharedPreferences preferences = context.getSharedPreferences(context.getString(R.string.preferences_key), Context.MODE_PRIVATE);

    String title = preferences.getString("daily_reminder__title", "Log activity");
    String body = preferences.getString("daily_reminder__body", "Did you log your activity today?");

    NotificationService.showNotification(title, body);
  }

  static void setupReminder() {
    Context context = MainActivity.getContext();

    AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

    if (manager == null) {
      return;
    }

    Calendar calendar = Calendar.getInstance();

    calendar.set(Calendar.HOUR_OF_DAY, 21);

    Intent intent = new Intent(context, DailyReminderReceiver.class);

    PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, 0);

    manager.setRepeating(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pendingIntent);
  }

  static void cancelReminder() {
    Context context = MainActivity.getContext();

    AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

    if (manager == null) {
      return;
    }

    Intent intent = new Intent(context, DailyReminderReceiver.class);
    PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, 0);

    manager.cancel(pendingIntent);
  }
}
