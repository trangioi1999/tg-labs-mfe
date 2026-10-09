/** Standard envelope for health endpoints exposed by backend services. */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  version?: string;
  timestamp: string;
}

/** Problem-details style error returned by the BFF. */
export interface ApiError {
  status: number;
  title: string;
  detail?: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
