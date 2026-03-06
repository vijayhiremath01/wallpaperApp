import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from './api';
import type { GetWallpapersResponse, Wallpaper } from '@/types/api.types';

async function fetchWallpapers() {
  const res = await api.get<GetWallpapersResponse>('/wallpapers', {
    params: { page: 1, limit: 20 },
  });
  return res.data;
}

export function useWallpapers() {
  const query = useQuery({
    queryKey: ['wallpapers'],
    queryFn: fetchWallpapers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const wallpapers: Wallpaper[] = query.data?.data ?? [];

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
