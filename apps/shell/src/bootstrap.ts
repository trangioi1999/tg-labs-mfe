import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { createAppConfig } from './app/app.config';
import type { RemoteModuleLoader } from './app/core/federation/remote-module-loader';

export function bootstrap(loader: RemoteModuleLoader): Promise<void> {
  return bootstrapApplication(App, createAppConfig(loader)).then(
    () => undefined,
    (error: unknown) => console.error(error),
  );
}
