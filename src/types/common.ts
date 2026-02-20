export interface PaginationFilter {
  limit?: number;
  page?: number;
}

export interface PaginatedResponse<A> {
  data: A[];
  total: number;
}

export interface ServerError {
  message: string;
  error_code?: string;
}

export interface ApiResponse {
  id: string;
  message: string;
}

export interface Asset {
  id: string;
  s3Key: string;
  fileName: string;
  contentType: string;
  url: string;
}
