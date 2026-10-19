import type { DbClient } from '../../db/db.module';
import { InventoryService } from './inventory.service';

describe('InventoryService paginated movements', () => {
  it('returns only the requested page with database-computed running balances', async () => {
    const execute = jest.fn().mockResolvedValueOnce({
        rows: [{
          date: '2026-06-01',
          item: 'Bran (debe)',
          quantityIn: '14.00',
          quantityOut: '7.00',
          source: 'Sales',
          remarks: 'Sold 1 gunia (7 debe) to Customer',
          balance: '21.00',
          total: 3,
        }],
      });
    const service = new InventoryService({ execute } as unknown as DbClient);

    const result = await service.getMovements('user-id', {
      page: 2,
      limit: 2,
      item: 'Bran',
      source: 'Sales',
    });

    expect(execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      items: [{
        date: '2026-06-01',
        item: 'Bran (debe)',
        quantityIn: 14,
        quantityOut: 7,
        source: 'Sales',
        remarks: 'Sold 1 gunia (7 debe) to Customer',
        balance: 21,
      }],
      total: 3,
      page: 2,
      limit: 2,
      totalPages: 2,
    });
  });

  describe('InventoryService dashboard summary', () => {
    it('returns today revenue and correctly converted inventory totals', async () => {
      const select = jest.fn()
        .mockImplementationOnce(() => ({
          from: () => ({ where: async () => [{
            maize: '1000', flour: '800', bran: '70',
            sacks5: '100', sacks10: '60', sacks25: '30',
          }] }),
        }))
        .mockImplementationOnce(() => ({
          from: () => ({ where: async () => [{ maize: '2000' }] }),
        }))
        .mockImplementationOnce(() => ({
          from: () => ({ where: async () => [{
            flour: '200', bran: '14', revenueToday: '12345',
            flourSacks5: '5', flourSacks10: '4', flourSacks25: '3',
          }] }),
        }))
        .mockImplementationOnce(() => ({
          from: () => ({
            where: () => ({
              groupBy: async () => [
                { size: 5, quantity: '120' },
                { size: 10, quantity: '70' },
                { size: 25, quantity: '40' },
              ],
            }),
          }),
        }));
      const service = new InventoryService({ select } as unknown as DbClient);

      await expect(service.getDashboardSummary('user-id', '2026-06-01')).resolves.toEqual({
        stats: {
          totalMaize: 1000,
          totalFlour: 800,
          totalBran: 10,
          efficiency: '80.00',
          totalRevenue: 12345,
        },
        stocks: {
          maize: 1000,
          flour: 600,
          bran: 8,
          sacks5kg: 20,
          sacks10kg: 10,
          sacks25kg: 10,
        },
        sackProductionBalances: [
          { size: 5, produced: 100, sold: 5, remaining: 95 },
          { size: 10, produced: 60, sold: 4, remaining: 56 },
          { size: 25, produced: 30, sold: 3, remaining: 27 },
        ],
      });
    });
  });

  it('returns an empty page with its total when the offset exceeds matching rows', async () => {
    const execute = jest.fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] });
    const service = new InventoryService({ execute } as unknown as DbClient);

    await expect(service.getMovements('user-id', { page: 3, limit: 5 })).resolves.toEqual({
      items: [],
      total: 0,
      page: 3,
      limit: 5,
      totalPages: 0,
    });
  });
});
