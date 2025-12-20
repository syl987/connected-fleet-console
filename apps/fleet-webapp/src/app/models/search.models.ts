import { PaginationParams } from './entity.models';

export interface SearchLogsParams extends PaginationParams {
  search?: string;
  mileage?: number;
  year?: number;
  vehicle?: number;
  severity?: string;
  code?: string;
  from?: string;
  to?: string;
}
