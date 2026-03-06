import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Wallpaper } from '@/types/api.types';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';

type Props = {
  item: Wallpaper;
  onPress: (item: Wallpaper) => void;
};

function WallpaperCardBase({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <View style={styles.card}>
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


