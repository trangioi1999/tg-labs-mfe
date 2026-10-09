import { PRIMARY_NAV, REMOTE_LIST, REMOTES, remoteLink } from './remotes';

describe('remote route contract', () => {
  it('uses unique remote names and base paths', () => {
    const names = REMOTE_LIST.map((r) => r.name);
    const paths = REMOTE_LIST.map((r) => r.basePath);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('builds absolute links inside a remote', () => {
    expect(remoteLink('blog')).toBe('/blog');
    expect(remoteLink('blog', 'tag', 'nx')).toBe('/blog/tag/nx');
  });

  it('derives the primary navigation from the remotes', () => {
    expect(PRIMARY_NAV.map((n) => n.path)).toEqual([
      '/blog',
      '/docs',
      '/tools',
      '/playground',
    ]);
    expect(REMOTES.tools.name).toBe('tools-mfe');
  });
});
