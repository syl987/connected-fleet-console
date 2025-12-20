import { PaginationParams } from './entity.models';

export interface SearchLogsParams extends PaginationParams {
  search?: string;
  mileage?: string;
  year?: string;
  vehicle?: string;
  severity?: string;
  code?: string;
  from?: string;
  to?: string;
}
