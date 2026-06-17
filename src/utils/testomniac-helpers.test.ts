import { describe, expect, it } from 'vitest';
import { buildArtifactUrl, buildRunStreamUrl } from './testomniac-helpers';

describe('buildArtifactUrl', () => {
  it('builds an artifact URL', () => {
    expect(buildArtifactUrl('https://api.example.com', 'runs/1/page.png')).toBe(
      'https://api.example.com/api/v1/artifacts/runs/1/page.png'
    );
  });

  it('appends the thumbnail query when requested', () => {
    expect(
      buildArtifactUrl('https://api.example.com', 'runs/1/page.png', {
        thumbnail: true,
      })
    ).toBe(
      'https://api.example.com/api/v1/artifacts/runs/1/page.png?thumbnail=true'
    );
  });

  it('strips a trailing slash from the base URL', () => {
    expect(buildArtifactUrl('https://api.example.com/', 'a.png')).toBe(
      'https://api.example.com/api/v1/artifacts/a.png'
    );
  });
});

describe('buildRunStreamUrl', () => {
  it('builds the SSE stream URL for a run', () => {
    expect(buildRunStreamUrl('https://api.example.com', 42)).toBe(
      'https://api.example.com/api/v1/runs/42/stream'
    );
  });

  it('accepts a string run id', () => {
    expect(buildRunStreamUrl('https://api.example.com', 'abc')).toBe(
      'https://api.example.com/api/v1/runs/abc/stream'
    );
  });
});
