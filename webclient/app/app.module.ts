import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }        from './app.component';
import { MapPageModule } from './map/map-page.module';
import { CarStatusPageModule } from './car-status/car-status-page.module';
import { AlertPageModule } from './alert/alert-page.module';
import { VehiclePageModule } from './vehicle/vehicle-page.module';
import { MapItemPageModule } from './tool/map-item-page.module';

import { routing, appRoutingProviders } from './app.routing';

import { APP_CONFIG, DEFAULT_APP_CONFIG } from './app-config';

import { BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { LocationService } from './shared/location.service';
import { RealtimeDeviceDataProviderService } from './shared/realtime-device-manager.service';
import { CarStatusDataService } from './car-status/summary/car-status-data.service';

class AppRequestOptions extends BaseRequestOptions {
  merge(options?:RequestOptionsArgs):RequestOptions {
    let webApiHost = DEFAULT_APP_CONFIG.webApiHost;
    if(webApiHost){
      options.url = window.location.protocol + '//' + webApiHost + options.url;
    }
    var result = super.merge(options);
    result.merge = this.merge;
    return result;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MapPageModule, CarStatusPageModule, AlertPageModule, VehiclePageModule, MapItemPageModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    appRoutingProviders,
    { provide: RequestOptions, useClass: AppRequestOptions },
    { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG },
    LocationService, RealtimeDeviceDataProviderService, CarStatusDataService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
