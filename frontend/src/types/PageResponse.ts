export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;      // current page index (0‐based)
  size: number;        // page size
  // any other pagination fields your backend returns…
}