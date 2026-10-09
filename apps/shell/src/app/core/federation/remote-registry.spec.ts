import { TestBed } from '@angular/core/testing';
import { REMOTES } from '@tg-labs/shared-config';
import { RemoteRegistry } from './remote-registry';
import { provideFakeFederation } from './testing';

function setup(...args: Parameters<typeof provideFakeFederation>) {
  TestBed.configureTestingModule({ providers: provideFakeFederation(...args) });
  return TestBed.inject(RemoteRegistry);
}

describe('RemoteRegistry', () => {
  it('enables only remotes present in the manifest, in contract order', () => {
    const registry = setup({
      'tools-mfe': '/mfe/tools/remoteEntry.json',
      'blog-mfe': '/mfe/blog/remoteEntry.json',
      'docs-mfe': '   ',
    });

    expect(registry.enabled.map((r) => r.name)).toEqual([
      'blog-mfe',
      'tools-mfe',
    ]);
    expect(registry.nav.map((n) => n.path)).toEqual(['/blog', '/tools']);
    expect(registry.isEnabled(REMOTES.docs.name)).toBe(false);
  });

  it('only blocks paths that belong to a disabled remote', () => {
    const registry = setup({ 'blog-mfe': '/mfe/blog/remoteEntry.json' });

    expect(registry.isPathEnabled('/blog/some-post')).toBe(true);
    expect(registry.isPathEnabled('/tools/json-formatter')).toBe(false);
    expect(registry.isPathEnabled('/about')).toBe(true);
  });

  it('initialises a remote lazily and only once', async () => {
    const initRemoteEntry = vi.fn().mockResolvedValue(undefined);
    const loadRemoteModule = vi.fn().mockResolvedValue({ routes: [] });
    const registry = setup(undefined, { initRemoteEntry, loadRemoteModule });

    expect(initRemoteEntry).not.toHaveBeenCalled();
    registry.prefetch('tools-mfe');
    await registry.loadModule('tools-mfe', './routes');
    await registry.loadModule('tools-mfe', './routes');

    expect(initRemoteEntry).toHaveBeenCalledTimes(1);
    expect(initRemoteEntry).toHaveBeenCalledWith(
      '/mfe/tools/remoteEntry.json',
      'tools-mfe',
    );
    expect(loadRemoteModule).toHaveBeenCalledWith('tools-mfe', './routes');
  });

  it('retries initialisation after a failure', async () => {
    const initRemoteEntry = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(undefined);
    const registry = setup(undefined, {
      initRemoteEntry,
      loadRemoteModule: vi.fn().mockResolvedValue({}),
    });

    await expect(registry.loadModule('blog-mfe', './routes')).rejects.toThrow(
      'offline',
    );
    await expect(registry.loadModule('blog-mfe', './routes')).resolves.toEqual(
      {},
    );
    expect(initRemoteEntry).toHaveBeenCalledTimes(2);
  });

  it('refuses to load a disabled remote', async () => {
    const registry = setup({});

    await expect(registry.loadModule('blog-mfe', './routes')).rejects.toThrow(
      'not enabled',
    );
  });
});
