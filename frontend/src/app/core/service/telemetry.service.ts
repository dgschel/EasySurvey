import { Injectable, Injector } from '@angular/core';
import { AngularPlugin, ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import {
  ApplicationInsights,
  ICustomProperties,
  IDependencyTelemetry,
  IEventTelemetry,
  IExceptionTelemetry,
  IMetricTelemetry,
  IPageViewTelemetry,
  ITraceTelemetry,
} from '@microsoft/applicationinsights-web';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppInsightsService {
  angularErrorInjector = Injector.create({
    providers: [
      {
        provide: ApplicationinsightsAngularpluginErrorService,
        useClass: ApplicationinsightsAngularpluginErrorService,
      },
    ],
  });

  private angularPlugin = new AngularPlugin(this.angularErrorInjector);
  private appInsights = new ApplicationInsights({
    config: {
      connectionString: environment.appInsights.connectionString,
      extensions: [this.angularPlugin],
    },
  });

  constructor() {
    this.appInsights.loadAppInsights();
    this.appInsights.addTelemetryInitializer((envelope) => {
      envelope.tags = envelope.tags || [];
      envelope.tags['ai.cloud.role'] = 'testTag';
    });
  }

  trackEvent(event: IEventTelemetry, customProperties?: ICustomProperties) {
    this.appInsights.trackEvent(event, customProperties);
  }

  startTrackEvent(name?: string) {
    this.appInsights.startTrackEvent(name);
  }

  stopTrackEvent(
    name: string,
    properties?: { [p: string]: string },
    measurements?: { [p: string]: number }
  ): any {
    this.appInsights.stopTrackEvent(name, properties, measurements);
  }

  trackPageView(pageView?: IPageViewTelemetry) {
    this.appInsights.trackPageView(pageView);
  }

  startTrackPage(name?: string) {
    this.appInsights.startTrackPage(name);
  }

  stopTrackPage(
    name?: string,
    url?: string,
    properties?: { [name: string]: string },
    measurements?: { [name: string]: number }
  ) {
    this.appInsights.stopTrackPage(name, url, properties, measurements);
  }

  trackMetric(metric: IMetricTelemetry, properties?: ICustomProperties) {
    this.appInsights.trackMetric(metric, properties);
  }

  trackException(
    exception: IExceptionTelemetry,
    properties?: ICustomProperties
  ) {
    this.appInsights.trackException(exception, properties);
  }

  trackTrace(message: ITraceTelemetry, properties?: ICustomProperties) {
    this.appInsights.trackTrace(message, properties);
  }

  trackDependencyData(dependency: IDependencyTelemetry) {
    this.appInsights.trackDependencyData(dependency);
  }

  flush() {
    this.appInsights.flush();
  }
}
