package li.pandemic;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.modules.i18nmanager.I18nUtil;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Pandemicli";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    I18nUtil.getInstance().allowRTL(getApplicationContext(), true);
  }
}
