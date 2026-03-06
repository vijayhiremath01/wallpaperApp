import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Props = {
  text?: string;
};

function LoadingStateBase({ text = 'Getting Best Images...' }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <ActivityIndicator color={colors.textPrimary} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

export const LoadingState = memo(LoadingStateBase);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  card: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    backgroundColor: colors.glassSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

