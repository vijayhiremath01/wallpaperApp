import { Image } from 'expo-image';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Wallpaper } from '@/types/api.types';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';

type Props = {
  item: Wallpaper;
  onPress: (item: Wallpaper) => void;
};

function hashToUnit(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function WallpaperCardBase({ item, onPress }: Props) {
  const height = useMemo(() => {
    const u = hashToUnit(item._id ?? item.imageUrl);
    return Math.round(220 + u * 100); // 220-320
  }, [item._id, item.imageUrl]);
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <View style={[styles.card, { height }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>
    </Pressable>
  );
}

export const WallpaperCard = memo(WallpaperCardBase);

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    margin: 8,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  card: {
    borderRadius: radii.card,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

