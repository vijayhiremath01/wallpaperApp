import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/LoadingState';
import { WallpaperCard } from '@/components/WallpaperCard';
import { useWallpapers } from '@/services/wallpaperService';
import type { Wallpaper } from '@/types/api.types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import type { RootStackScreenProps } from '@/navigation/RootNavigator';

type Props = RootStackScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const {
    wallpapers,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
  } = useWallpapers();

  const onPress = useCallback(
    (item: Wallpaper) => {
      navigation.navigate('Preview', { id: item._id, imageUrl: item.imageUrl });
    },
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<Wallpaper>>(
    ({ item, index }) => {
      const isLeft = index % 2 === 0;
      return (
        <View style={[styles.item, isLeft ? styles.itemLeft : styles.itemRight]}>
          <WallpaperCard item={item} onPress={onPress} />
        </View>
      );
    },
    [onPress],
  );

  const keyExtractor = useCallback((item: Wallpaper) => item._id, []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListHeaderComponent = (
    <SafeAreaView edges={['top']} style={styles.safeHeader}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Wallpapers</Text>
          <Text style={styles.subtitle}>Dark glass gallery</Text>
        </View>
        {isFetching && (
          <View style={styles.pill}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  if (isError && wallpapers.length === 0) {
    const message = 'Server waking up, please wait...';
    return (
      <View style={styles.errorRoot}>
        <Text style={styles.errorTitle}>Couldn&apos;t load wallpapers</Text>
        <Text style={styles.errorSubtitle}>{message}</Text>
      </View>
    );
  }

  if (isLoading && wallpapers.length === 0) {
    return <LoadingState text="Getting Best Images..." />;
  }

  return (
    <View style={styles.root}>
      {ListHeaderComponent}
      <FlatList
        data={wallpapers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isFetching && wallpapers.length > 0}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.textPrimary} />
            </View>
          ) : isFetching && wallpapers.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.textPrimary} />
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  title: {
    ...typography.title,
    color: colors.textPrimary,
  },

  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },

  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.card,
  },

  listContent: {
    paddingHorizontal: 8,
    paddingBottom: spacing.xxl,
  },

  item: {
    flex: 1,
  },

  itemLeft: {
    marginRight: 4,
  },

  itemRight: {
    marginLeft: 4,
  },

  footer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorRoot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  errorTitle: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});