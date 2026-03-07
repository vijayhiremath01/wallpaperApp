import { BlurView } from 'expo-blur';
import React, { memo } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

function GlassContainerBase({ children, style, intensity = 22 }: Props) {
  return (
    <View style={[styles.shell, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.glassOverlay} />
      {children}
    </View>
  );
}

export const GlassContainer = memo(GlassContainerBase);

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.glassSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

