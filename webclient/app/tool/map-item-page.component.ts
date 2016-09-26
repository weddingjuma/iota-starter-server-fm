import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ItemMapComponent } from './item-map/item-map.component';
import { ItemToolComponent } from './item-tool/item-tool.component';
import { LocationService, MapArea } from '../shared/location.service';
import { APP_CONFIG, AppConfig } from '../app-config';

import * as _ from 'underscore';

@Component({
  moduleId: module.id,
  selector: 'fmdash-map-item-edit-page',
  templateUrl: 'map-item-page.component.html',
  providers: [],
})
export class MapItemPageComponent implements OnInit {
  areas: MapArea[];
  regions: MapArea[];
  selectedArea: MapArea;
  mapLastSelectedArea: MapArea;

  //
  // Web API host
  //
  webApiBaseUrl: string;

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    @Inject(APP_CONFIG) appConfig: AppConfig
  ) {
    this.webApiBaseUrl = window.location.protocol + "//" + appConfig.webApiHost;
    this.locationService = locationService;
    this.areas = locationService.getAreas().map(x => x);
    this.regions = locationService.getRegions().map(x => x);
  }

  get htmlClientInitialLocation(){
    let mapRegion = this.locationService.getMapRegion();
    let e = mapRegion && mapRegion.extent;
    if (e) {
      let lng = (e[0] + e[2]) / 2, lat = (e[1] + e[3]) / 2;
      return "" + lat + "," + lng;
    }
    return "";
  }

  ngOnInit() {
    // move location
    this.selectedArea = this.areas[this.areas.length - 1];
    if (this.locationService.getMapRegion()) {
      if (this.locationService.getCurrentAreaRawSync()) {
        this.areas.push(this.locationService.getCurrentAreaRawSync());
      }
      this.areas.push(this.locationService.getMapRegion());
    } else {
      this.locationService.getCurrentArea().then(area => {
        if (this.locationService.getCurrentAreaRawSync()) {
          this.areas.push(this.locationService.getCurrentAreaRawSync());
        }
        this.selectedArea = area;
      }).catch(ex => {
        this.selectedArea = this.areas[0];
      });
    }
  }
}
