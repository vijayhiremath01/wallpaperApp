export type ApiSuccess<T> = {
  success: true;
} & T;

export type ApiError = {
  success: false;
  message: string;
  error?: string;
};

export type Wallpaper = {
  _id: string;
  imageUrl: string;
  downloads?: number;
  createdAt?: string;
};

export type GetWallpapersResponse = ApiSuccess<{
  page: number;
  limit: number;
  total: number;
  data: Wallpaper[];
}>;

