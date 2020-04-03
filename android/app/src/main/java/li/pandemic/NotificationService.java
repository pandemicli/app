package li.pandemic;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class NotificationService extends FirebaseMessagingService {

  @Override
  public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
    RemoteMessage.Notification notification = remoteMessage.getNotification();

    if (notification == null) {
      return;
    }

    String title = remoteMessage.getNotification().getTitle();
    String body = remoteMessage.getNotification().getBody();

    NotificationService.showNotification(title, body);

    MainApplication application = (MainApplication) this.getApplication();

    ReactNativeHost reactNativeHost = application.getReactNativeHost();
    ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
    ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

    if (reactContext == null) {
      return;
    }

    WritableMap map = Arguments.createMap();

    map.putString("title", title);
    map.putString("body", body);

    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("NotificationReceived", map);
  }

  static void showNotification(String title, String body) {
    Context context = MainActivity.getContext();

    Intent intent = new Intent(context, MainActivity.class);

    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_ONE_SHOT);

    String channelId = context.getString(R.string.default_notification_channel_id);

    NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, channelId)
      .setSmallIcon(R.drawable.ic_notification)
      .setContentTitle(title)
      .setContentText(body)
      .setAutoCancel(true)
      .setContentIntent(pendingIntent);

    NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

    if (notificationManager == null) {
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(channelId, "Default", NotificationManager.IMPORTANCE_DEFAULT);

      notificationManager.createNotificationChannel(channel);
    }

    notificationManager.notify(0, notificationBuilder.build());
  }
}
