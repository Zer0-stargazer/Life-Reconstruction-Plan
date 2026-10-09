import { describe, expect, it } from 'vitest';
import { CAREER_RESOURCES } from './career-resources';
import { careers, getCareerResources } from './careers';

describe('career resources', () => {
  it('every resource key is a real career name', () => {
    const names = new Set(careers.map((c) => c.name));
    const unknown = Object.keys(CAREER_RESOURCES).filter((k) => !names.has(k));
    expect(unknown).toEqual([]);
  });

  it('every link is https and not a generic search page', () => {
    const bad: string[] = [];
    for (const set of Object.values(CAREER_RESOURCES)) {
      for (const link of [...(set.videos ?? []), ...(set.docs ?? [])]) {
        if (!link.url.startsWith('https://') || /[?&](q|keyword|wd|search)=/i.test(link.url)) {
          bad.push(link.url);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('returns empty arrays for careers without curated resources', () => {
    const fallback = getCareerResources({ name: '__不存在的职业__' });
    expect(fallback).toEqual({ videos: [], docs: [], books: [] });
  });

  it('does not return another career\'s resources', () => {
    const known = Object.keys(CAREER_RESOURCES)[0];
    const result = getCareerResources({ name: known });
    expect(result.videos).toEqual(CAREER_RESOURCES[known].videos ?? []);
  });
});
