/** Branded type for tab IDs to ensure type safety */
export type TabId = number & { readonly __brand: unique symbol };

export interface CacheEntry {
  data: string;
  timestamp: number;
}

export interface OutlierAssistantRequest {
  outlierassistant: string;
  forceRefresh?: boolean;
  autoCreateTab?: boolean;
}

export interface OutlierAssistantResponse {
  outlierassistant: string;
}

export interface ErrorResult {
  error: string;
  errorCode: ErrorCode;
}

export type ErrorCode =
  | 'NOT_LOGGED_IN'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'API_REQUEST_FAILED'
  | 'PERMISSION_ERROR'
  | 'TAB_ERROR'
  | 'INVALID_JSON'
  | 'HANDLER_ERROR'
  | 'CLEAR_CACHE_ERROR'
  | 'UNKNOWN_COMMAND'
  | 'INVALID_MESSAGE'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export const OUTLIER_URL = 'https://app.outlier.ai/';
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 2;
export const RETRY_DELAY = 1000; // 1 second base delay
export const TAB_LOAD_TIMEOUT = 15000; // 15 seconds
