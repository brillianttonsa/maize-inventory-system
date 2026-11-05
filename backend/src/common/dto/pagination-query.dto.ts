import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  item?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  @IsIn(['All', 'flour', 'bran'])
  product_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsIn([5, 10, 25])
  sack_size?: number;
}

export class DashboardSummaryQueryDto {
  @IsDateString()
  date!: string;
}

export class DateRangeQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPagination(
  query: PaginationQueryDto,
): { page: number; limit: number; offset: number } | undefined {
  if (query.page === undefined && query.limit === undefined) {
    return undefined;
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  return { page, limit, offset: (page - 1) * limit };
}
