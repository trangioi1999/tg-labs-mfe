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
  REMOTE_MODULE_LOADER,
  type RemoteModuleLoader,
} from './core/federation/remote-module-loader';
import { SiteTitleStrategy } from './core/site-title-strategy';

export function createAppConfig(loader: RemoteModuleLoader): ApplicationConfig {
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
      { provide: REMOTE_MODULE_LOADER, useValue: loader },
    ],
  };
}
