export interface InputPagination {
  startId: number;
  offset: number;
  limit: number;
}

export interface OutputPagination {
  page: number;
  limit: number;
  sort: string;
  order: string;
}
