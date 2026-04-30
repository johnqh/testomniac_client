import { describe, it, expect } from 'vitest';
import { QUERY_KEYS } from './types';

describe('QUERY_KEYS', () => {
  describe('user', () => {
    it('should return correct key for a user', () => {
      const key = QUERY_KEYS.user('user-xyz');
      expect(key).toEqual(['testomniac', 'user', 'user-xyz']);
    });

    it('should have user as second element', () => {
      const key = QUERY_KEYS.user('any-user');
      expect(key[1]).toBe('user');
    });
  });

  it('entityProjects key includes slug', () => {
    const key = QUERY_KEYS.entityProjects('my-org');
    expect(key).toEqual(['testomniac', 'projects', 'my-org']);
  });

  it('run key includes runId', () => {
    const key = QUERY_KEYS.run(42);
    expect(key).toEqual(['testomniac', 'run', 42]);
  });

  it('appFindings key includes appId', () => {
    const key = QUERY_KEYS.appFindings(7);
    expect(key).toEqual(['testomniac', 'app', 7, 'findings']);
  });
});
