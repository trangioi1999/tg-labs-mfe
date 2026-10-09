import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  FEDERATION_RUNTIME,
  type FederationRuntime,
  REMOTE_MANIFEST,
  type RemoteManifest,
} from './core/federation/remote-registry';
import { SiteTitleStrategy } from './core/site-title-strategy';

export function createAppConfig(
  manifest: RemoteManifest,
  runtime: FederationRuntime,
): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(
        appRoutes,
        withInMemoryScrolling({
          scrollPositionRestoration: 'enabled',
          anchorScrolling: 'enabled',
        }),
      ),
      { provide: TitleStrategy, useClass: SiteTitleStrategy },
      { provide: REMOTE_MANIFEST, useValue: manifest },
      { provide: FEDERATION_RUNTIME, useValue: runtime },
    ],
  };
}
