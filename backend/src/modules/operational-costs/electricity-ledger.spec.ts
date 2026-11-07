import { BadRequestException } from '@nestjs/common';
import { validateElectricityEvents } from './electricity-ledger';

describe('validateElectricityEvents', () => {
  it('reconciles consecutive operations against electricity purchases', () => {
    const balance = validateElectricityEvents(
      [{ id: 'purchase', units: 100, created_at: new Date('2026-01-01T08:00:00Z') }],
      [
        {
          id: 'first',
          starting_units: 100,
          remaining_units: 70,
          units_used: 30,
          created_at: new Date('2026-01-01T09:00:00Z'),
        },
        {
          id: 'second',
          starting_units: 70,
          remaining_units: 60,
          units_used: 10,
          created_at: new Date('2026-01-01T10:00:00Z'),
        },
      ],
    );

    expect(balance).toBe(60);
  });

  it('rejects a starting reading that does not match the previous balance', () => {
    expect(() =>
      validateElectricityEvents(
        [{ id: 'purchase', units: 100, created_at: new Date('2026-01-01T08:00:00Z') }],
        [{
          id: 'operation',
          starting_units: 90,
          remaining_units: 80,
          units_used: 10,
          created_at: new Date('2026-01-01T09:00:00Z'),
        }],
      ),
    ).toThrow(BadRequestException);
  });

  it('allows additional units bought after an earlier operation', () => {
    const balance = validateElectricityEvents(
      [
        { id: 'first-purchase', units: 100, created_at: new Date('2026-01-01T08:00:00Z') },
        { id: 'second-purchase', units: 50, created_at: new Date('2026-01-01T10:00:00Z') },
      ],
      [{
        id: 'operation',
        starting_units: 100,
        remaining_units: 80,
        units_used: 20,
        created_at: new Date('2026-01-01T09:00:00Z'),
      }],
    );

    expect(balance).toBe(130);
  });
});
