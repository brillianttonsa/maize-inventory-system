import 'reflect-metadata';
import { getPagination, PaginationQueryDto } from './pagination-query.dto';

describe('getPagination', () => {
  it('keeps legacy requests unpaginated when no page options are supplied', () => {
    expect(getPagination({})).toBeUndefined();
  });

  it('defaults page and limit when only one pagination option is supplied', () => {
    expect(getPagination({ page: 3 } as PaginationQueryDto)).toEqual({
      page: 3,
      limit: 20,
      offset: 40,
    });
    expect(getPagination({ limit: 5 } as PaginationQueryDto)).toEqual({
      page: 1,
      limit: 5,
      offset: 0,
    });
  });

  it('calculates the correct offset for a requested page', () => {
    expect(getPagination({ page: 4, limit: 7 } as PaginationQueryDto)).toEqual({
      page: 4,
      limit: 7,
      offset: 21,
    });
  });
});
