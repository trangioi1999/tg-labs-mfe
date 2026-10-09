import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { createAppConfig } from './app/app.config';
import type {
  FederationRuntime,
  RemoteManifest,
} from './app/core/federation/remote-registry';

export function bootstrap(
  manifest: RemoteManifest,
  runtime: FederationRuntime,
): Promise<void> {
  return bootstrapApplication(App, createAppConfig(manifest, runtime)).then(
    () => undefined,
    (error: unknown) => console.error(error),
  );
}
