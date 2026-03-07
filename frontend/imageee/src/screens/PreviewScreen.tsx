import { Image } from 'expo-image';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

import { showRewardedAd } from '@/ads/rewardedAd';
import type { RootStackScreenProps } from '@/navigation/RootNavigator';
import { colors } from '@/theme/colors';
import { spacing, radii } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { trackDownload } from '@/services/wallpaperService';

type Props = RootStackScreenProps<'Preview'>;

export function PreviewScreen({ navigation, route }: Props) {
  const { id, imageUrl } = route.params;
  const [downloading, setDownloading] = useState(false);

  const onBack = useCallback(() => navigation.goBack(), [navigation]);

  const onDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Please allow access to save wallpapers to your gallery.');
        setDownloading(false);
        return;
      }

      // Record download and prefer imageUrl from backend if provided
      let url = imageUrl;
      try {
        const result = await trackDownload(id);
        if (result?.imageUrl) {
          url = result.imageUrl;
        }
      } catch {
        // If tracking fails, still try to download using original URL
      }

      const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
      const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
      const fileUri = `${baseDir}${id}.${extension}`;

      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const result = await downloadResumable.downloadAsync();

      if (!result?.uri) {
        throw new Error('Download failed');
      }

      const asset = await MediaLibrary.createAssetAsync(result.uri);

      let album = await MediaLibrary.getAlbumAsync('Wallpapers');

      if (!album) {
        album = await MediaLibrary.createAlbumAsync('Wallpapers', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Saved', 'Wallpaper saved to gallery');
    } catch (e) {
      const msg = typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : 'Failed';
      Alert.alert('Error', msg);
    } finally {
      setDownloading(false);
    }
  }, [downloading, id, imageUrl]);

  const downloadLabel = useMemo(() => (downloading ? 'Downloading…' : 'Download'), [downloading]);
  const onDownloadPress = useCallback(() => {
    showRewardedAd(() => {
      void onDownload();
    });
  }, [onDownload]);

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={240}
        cachePolicy="memory-disk"
      />
      <View pointerEvents="none" style={styles.darkScrim} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconButton}>
            <View style={styles.iconGlass}>
              <ArrowLeft size={18} color={colors.textPrimary} />
            </View>
          </Pressable>

          <Pressable onPress={onDownloadPress} disabled={downloading} hitSlop={12} style={styles.downloadButton}>
            <View style={[styles.downloadGlass, downloading && styles.downloadDisabled]}>
              <Download size={18} color={colors.textPrimary} />
              <Text style={styles.downloadText}>{downloadLabel}</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  darkScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  iconButton: {
    borderRadius: radii.pill,
  },
  iconGlass: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  downloadButton: {
    borderRadius: radii.pill,
  },
  downloadGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  downloadDisabled: {
    opacity: 0.7,
  },
  downloadText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
});
