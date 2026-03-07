import Constants from 'expo-constants';
import { NativeModules } from 'react-native';

const prodAdUnitId = 'ca-app-pub-2631213106885088/9535507684';

export function showRewardedAd(onReward: () => void) {
  // Expo Go has no native AdMob
  if (Constants.appOwnership === 'expo') {
    onReward();
    return;
  }

  let RewardedAd: any;
  let RewardedAdEventType: any;
  let TestIds: any;

  try {
    ({ RewardedAd, RewardedAdEventType, TestIds } = require('react-native-google-mobile-ads'));
  } catch {
    onReward();
    return;
  }

  if (!NativeModules?.RNGoogleMobileAdsModule) {
    onReward();
    return;
  }

  try {
    const adUnitId = __DEV__ ? TestIds.REWARDED : prodAdUnitId;
    const rewarded = RewardedAd.createForAdRequest(adUnitId);

    let rewardEarned = false;

    let unsubscribeLoaded: any;
    let unsubscribeReward: any;
    let unsubscribeClosed: any;
    let unsubscribeError: any;

    const cleanup = () => {
      unsubscribeLoaded?.();
      unsubscribeReward?.();
      unsubscribeClosed?.();
      unsubscribeError?.();
    };

    unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    unsubscribeReward = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      rewardEarned = true;
      onReward();
      cleanup();
    });

    unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      cleanup();
      if (!rewardEarned) {
        onReward();
      }
    });

    unsubscribeError = rewarded.addAdEventListener(RewardedAdEventType.ERROR, () => {
      cleanup();
      if (!rewardEarned) {
        onReward();
      }
    });

    rewarded.load();
  } catch {
    onReward();
  }
}
