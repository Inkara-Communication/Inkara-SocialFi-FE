/* eslint-disable @typescript-eslint/no-explicit-any */
import { OutputPagination } from '@/apis/dto/pagination.dto';

//----------------------------------------------------------------------------

export interface IApiResponse<T> {
  data: T;
  paging: OutputPagination;
  total: number;
  filter: Record<string, any>;
}
