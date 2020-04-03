package li.pandemic;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.i18nmanager.I18nUtil;

public class MainActivity extends ReactActivity {

  private static Context context;

  @Override
  protected String getMainComponentName() {
    return "Pandemicli";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    context = this;

    I18nUtil.getInstance().allowRTL(getApplicationContext(), true);
  }

  static Context getContext() {
    return context;
  }
}
