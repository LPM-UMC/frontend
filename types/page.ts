export enum Order {
  asc = "asc",
  desc = "desc",
}

export type PagingRequest = {
  page: number;
  size: number;
  order: Order;
  search?: string;
}

export type PagingResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    size: number;
    total_pages: number;
  }
}
