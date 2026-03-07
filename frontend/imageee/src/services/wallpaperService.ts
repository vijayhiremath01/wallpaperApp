import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';
import type { GetWallpapersResponse, Wallpaper } from '@/types/api.types';

const PAGE_SIZE = 20;

export function useWallpapers() {
  const query = useInfiniteQuery({
    queryKey: ['wallpapers', 'infinite', PAGE_SIZE],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<GetWallpapersResponse>('/wallpapers', {
        params: { page: pageParam, limit: PAGE_SIZE },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      return loaded >= lastPage.total ? undefined : lastPage.page + 1;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const wallpapers: Wallpaper[] = query.data?.pages.flatMap((p) => p.data) ?? [];

  return {
    ...query,
    wallpapers,
  };
}

export function useTrackDownload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<{ success: boolean; imageUrl?: string }>(`/wallpapers/${id}/download`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallpapers'] });
    },
  });
}

export function useDeleteWallpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{ success: boolean }>(`/wallpapers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallpapers'] });
    },
  });
}

export function useUpdateWallpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; imageUrl?: string }) => {
      const res = await api.patch<{ success: boolean; data?: unknown }>(`/wallpapers/${input.id}`, {
        imageUrl: input.imageUrl,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallpapers'] });
    },
  });
}

export function useUploadWallpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: { name: string; type: string; uri: string }) => {
      const fd = new FormData();
      // @ts-ignore - RN FormData supports this shape
      fd.append('image', { uri: file.uri, name: file.name, type: file.type });
      const res = await api.post<{ success: boolean; data?: unknown }>('/wallpapers/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallpapers'] });
    },
  });
}

export async function trackDownload(id: string) {
  const res = await api.post<{ success: boolean; imageUrl?: string }>(`/wallpapers/${id}/download`);
  return res.data;
}
