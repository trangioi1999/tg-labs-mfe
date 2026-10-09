import { matchesQuery, readingMinutes, slugify, truncate } from './text';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('  Native Federation 101! ')).toBe('native-federation-101');
  });

  it('strips diacritics', () => {
    expect(slugify('Tiếng Việt Đẹp')).toBe('tieng-viet-dep');
  });
});

describe('truncate', () => {
  it('returns short input unchanged', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('cuts on a word boundary', () => {
    expect(truncate('the quick brown fox', 12)).toBe('the quick…');
  });
});

describe('readingMinutes', () => {
  it('never returns less than one minute', () => {
    expect(readingMinutes('one two three')).toBe(1);
  });

  it('scales with word count', () => {
    expect(readingMinutes(Array(660).fill('word').join(' '))).toBe(3);
  });
});

describe('matchesQuery', () => {
  it('matches case- and accent-insensitively', () => {
    expect(matchesQuery('Kiến trúc Micro Frontend', 'kien truc')).toBe(true);
  });

  it('treats an empty query as a match', () => {
    expect(matchesQuery('anything', '   ')).toBe(true);
  });

  it('rejects non-matching text', () => {
    expect(matchesQuery('Angular', 'react')).toBe(false);
  });
});
