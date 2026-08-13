import { describe, expect, it, vi } from 'vitest';
import type { Lead } from './types';
import { applyFilter } from './useLeads';
import type { FilterParam } from '@/types';

function createQueryStub() {
  const query = {
    eq: vi.fn(() => query),
    neq: vi.fn(() => query),
    in: vi.fn(() => query),
    ilike: vi.fn(() => query),
    gt: vi.fn(() => query),
    gte: vi.fn(() => query),
    lt: vi.fn(() => query),
    lte: vi.fn(() => query),
  };
  return query;
}

describe('applyFilter', () => {
  it("maps 'eq' to an exact-match column filter", () => {
    const query = createQueryStub();
    const filter: FilterParam<Lead> = {
      key: 'status',
      operator: 'eq',
      value: 'NEW',
    };

    applyFilter(query, filter);

    expect(query.eq).toHaveBeenCalledWith('status', 'NEW');
  });

  it("maps 'ne' to a not-equal column filter", () => {
    const query = createQueryStub();
    applyFilter(query, { key: 'status', operator: 'ne', value: 'LOST' });

    expect(query.neq).toHaveBeenCalledWith('status', 'LOST');
  });

  it("maps 'in' to a membership filter over a list of values", () => {
    const query = createQueryStub();
    applyFilter(query, {
      key: 'status',
      operator: 'in',
      value: ['NEW', 'CONTACTING'],
    });

    expect(query.in).toHaveBeenCalledWith('status', ['NEW', 'CONTACTING']);
  });

  it("maps 'c' (contains) to a wildcard-both-sides ilike", () => {
    const query = createQueryStub();
    applyFilter(query, {
      key: 'customer_name',
      operator: 'c',
      value: 'doe',
    });

    expect(query.ilike).toHaveBeenCalledWith('customer_name', '%doe%');
  });

  it("maps 'sw' (starts with) to a trailing-wildcard ilike", () => {
    const query = createQueryStub();
    applyFilter(query, { key: 'customer_name', operator: 'sw', value: 'Ja' });

    expect(query.ilike).toHaveBeenCalledWith('customer_name', 'Ja%');
  });

  it("maps 'ew' (ends with) to a leading-wildcard ilike", () => {
    const query = createQueryStub();
    applyFilter(query, { key: 'customer_name', operator: 'ew', value: 'oe' });

    expect(query.ilike).toHaveBeenCalledWith('customer_name', '%oe');
  });

  it.each([
    ['gt', 'gt'],
    ['gte', 'gte'],
    ['lt', 'lt'],
    ['lte', 'lte'],
  ] as const)(
    "maps '%s' to the matching comparison filter",
    (operator, method) => {
      const query = createQueryStub();
      applyFilter(query, { key: 'created_at', operator, value: '2026-01-01' });

      expect(query[method]).toHaveBeenCalledWith('created_at', '2026-01-01');
    },
  );

  it('returns the query untouched for an unrecognized operator', () => {
    const query = createQueryStub();
    const result = applyFilter(query, {
      key: 'status',
      // @ts-expect-error deliberately invalid operator to assert the fallback branch
      operator: 'unknown',
      value: 'NEW',
    });

    expect(result).toBe(query);
    Object.values(query).forEach((fn) => expect(fn).not.toHaveBeenCalled());
  });
});
