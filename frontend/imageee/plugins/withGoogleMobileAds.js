const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

const ANDROID_APP_ID_META = 'com.google.android.gms.ads.APPLICATION_ID';
const IOS_APP_ID_KEY = 'GADApplicationIdentifier';

function setAndroidAppId(config, androidAppId) {
  if (!androidAppId) return config;

  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (!app) return config;

    app['meta-data'] = app['meta-data'] || [];

    const existing = app['meta-data'].find(
      (item) => item?.$?.['android:name'] === ANDROID_APP_ID_META,
    );

    if (existing) {
      existing.$['android:value'] = androidAppId;
    } else {
      app['meta-data'].push({
        $: {
          'android:name': ANDROID_APP_ID_META,
          'android:value': androidAppId,
        },
      });
    }

    return config;
  });
}

function setIosAppId(config, iosAppId) {
  if (!iosAppId) return config;

  return withInfoPlist(config, (config) => {
    config.modResults[IOS_APP_ID_KEY] = iosAppId;
    return config;
  });
}

module.exports = function withGoogleMobileAds(config, props = {}) {
  const { androidAppId, iosAppId } = props;
  let updated = config;
  updated = setAndroidAppId(updated, androidAppId);
  updated = setIosAppId(updated, iosAppId);
  return updated;
};
