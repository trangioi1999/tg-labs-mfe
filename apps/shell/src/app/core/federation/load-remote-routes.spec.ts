import { TestBed } from '@angular/core/testing';
import type { Route, Routes } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { RemoteUnavailable } from '../../pages/remote-unavailable/remote-unavailable';
import { loadRemoteRoutes } from './load-remote-routes';
import type { FederationRuntime } from './remote-registry';
import { provideFakeFederation } from './testing';

function run(
  loadRemoteModule: FederationRuntime['loadRemoteModule'],
  timeoutMs?: number,
): Promise<Routes> {
  TestBed.configureTestingModule({
    providers: provideFakeFederation(undefined, { loadRemoteModule }),
  });
  return TestBed.runInInjectionContext(() =>
    loadRemoteRoutes(REMOTES.blog, timeoutMs)(),
  );
}

describe('loadRemoteRoutes', () => {
  beforeEach(() =>
    vi.spyOn(console, 'error').mockImplementation(() => undefined),
  );

  it('returns the routes exposed by the remote', async () => {
    const remoteRoutes: Route[] = [{ path: '' }];
    const loader = vi.fn().mockResolvedValue({ routes: remoteRoutes });

    const routes = await run(loader);

    expect(loader).toHaveBeenCalledWith('blog-mfe', './routes');
    expect(routes).toBe(remoteRoutes);
  });

  it('falls back to the unavailable page when the remote fails', async () => {
    const routes = await run(vi.fn().mockRejectedValue(new Error('offline')));

    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('**');
    expect(routes[0].component).toBe(RemoteUnavailable);
    expect(routes[0].data?.['remote']).toBe(REMOTES.blog);
  });

  it('falls back when the module has no routes export', async () => {
    const routes = await run(
      vi.fn().mockResolvedValue({ somethingElse: true }),
    );

    expect(routes[0].component).toBe(RemoteUnavailable);
  });

  it('falls back when the remote does not answer in time', async () => {
    const routes = await run(
      vi.fn().mockReturnValue(new Promise(() => undefined)),
      10,
    );

    expect(routes[0].component).toBe(RemoteUnavailable);
  });
});
