/**
 * Inicialización de Azure Application Insights.
 *
 * IMPORTANTE: esta función debe llamarse ANTES de importar/crear el AppModule
 * de NestJS para que el SDK pueda instrumentar correctamente Express, HTTP,
 * PostgreSQL, etc. Por eso se importa al principio de main.ts.
 *
 * Lee la variable APPLICATIONINSIGHTS_CONNECTION_STRING. Si está vacía,
 * simplemente no se inicializa (útil para desarrollo local sin Azure).
 */
import * as appInsights from 'applicationinsights';

export function setupApplicationInsights(): void {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString || connectionString.trim() === '') {
    // eslint-disable-next-line no-console
    console.log(
      '[AppInsights] APPLICATIONINSIGHTS_CONNECTION_STRING vacío. Telemetría deshabilitada.',
    );
    return;
  }

  appInsights
    .setup(connectionString)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);

  appInsights.defaultClient.context.tags[
    appInsights.defaultClient.context.keys.cloudRole
  ] = 'pet-radar-api';

  appInsights.start();

  // eslint-disable-next-line no-console
  console.log('[AppInsights] Telemetría activada para pet-radar-api.');
}
