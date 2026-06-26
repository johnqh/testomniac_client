import { describe, expect, it } from 'vitest';
import { createQueryKey, getServiceKeys, queryKeys } from '../query-keys';

describe('queryKeys.testomniac', () => {
  describe('user', () => {
    it('returns the correct key for a user', () => {
      const key = queryKeys.testomniac.user('user-xyz');
      expect(key).toEqual(['testomniac', 'user', 'user-xyz']);
    });

    it('has user as the second element', () => {
      const key = queryKeys.testomniac.user('any-user');
      expect(key[1]).toBe('user');
    });
  });

  it('entityProducts key includes slug', () => {
    const key = queryKeys.testomniac.entityProducts('my-org');
    expect(key).toEqual(['testomniac', 'products', 'my-org']);
  });

  it('run key includes runId', () => {
    const key = queryKeys.testomniac.run(42);
    expect(key).toEqual(['testomniac', 'run', 42]);
  });

  it('runnerFindings key includes runnerId', () => {
    const key = queryKeys.testomniac.runnerFindings(7);
    expect(key).toEqual(['testomniac', 'runner', 7, 'findings']);
  });

  it('runFindingSummary key includes runId', () => {
    const key = queryKeys.testomniac.runFindingSummary(42);
    expect(key).toEqual(['testomniac', 'run', 42, 'findings-summary']);
  });

  it('effectiveEnvironmentScanSettings key includes product and environment ids', () => {
    const key = queryKeys.testomniac.effectiveEnvironmentScanSettings(7, 11);
    expect(key).toEqual([
      'testomniac',
      'product',
      7,
      'environment',
      11,
      'effective-scan-settings',
    ]);
  });

  it('all() returns the root key', () => {
    expect(queryKeys.testomniac.all()).toEqual(['testomniac']);
  });
});

describe('getServiceKeys', () => {
  it('returns the root testomniac key', () => {
    expect(getServiceKeys()).toEqual(['testomniac']);
  });
});

describe('createQueryKey', () => {
  it('prepends the service name to the parts', () => {
    expect(createQueryKey('testomniac', 'custom', { id: 1 })).toEqual([
      'testomniac',
      'custom',
      { id: 1 },
    ]);
  });
});
