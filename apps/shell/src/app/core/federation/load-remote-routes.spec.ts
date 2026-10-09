import { TestBed } from '@angular/core/testing';
import type { Route, Routes } from '@angular/router';
import { REMOTES } from '@tg-labs/shared-config';
import { RemoteUnavailable } from '../../pages/remote-unavailable/remote-unavailable';
import { loadRemoteRoutes } from './load-remote-routes';
import {
  REMOTE_MODULE_LOADER,
  type RemoteModuleLoader,
} from './remote-module-loader';

function run(loader: RemoteModuleLoader, timeoutMs?: number): Promise<Routes> {
  TestBed.configureTestingModule({
    providers: [{ provide: REMOTE_MODULE_LOADER, useValue: loader }],
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

    const routes = await run(loader as RemoteModuleLoader);

    expect(loader).toHaveBeenCalledWith('blog-mfe', './routes');
    expect(routes).toBe(remoteRoutes);
  });

  it('falls back to the unavailable page when the remote fails', async () => {
    const loader = vi.fn().mockRejectedValue(new Error('offline'));

    const routes = await run(loader as RemoteModuleLoader);

    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('**');
    expect(routes[0].component).toBe(RemoteUnavailable);
    expect(routes[0].data?.['remote']).toBe(REMOTES.blog);
  });

  it('falls back when the module has no routes export', async () => {
    const loader = vi.fn().mockResolvedValue({ somethingElse: true });

    const routes = await run(loader as RemoteModuleLoader);

    expect(routes[0].component).toBe(RemoteUnavailable);
  });

  it('falls back when the remote does not answer in time', async () => {
    const loader = vi.fn().mockReturnValue(new Promise(() => undefined));

    const routes = await run(loader as RemoteModuleLoader, 10);

    expect(routes[0].component).toBe(RemoteUnavailable);
  });
});
