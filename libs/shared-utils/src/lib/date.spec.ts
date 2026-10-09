import { formatDate } from './date';

describe('formatDate', () => {
  it('formats ISO dates as UTC calendar dates', () => {
    expect(formatDate('2026-01-05')).toBe('Jan 5, 2026');
  });

  it('returns the input when it is not a valid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
