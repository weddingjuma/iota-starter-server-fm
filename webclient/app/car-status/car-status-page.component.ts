/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the IBM License, a copy of which may be obtained at:
 *
 * http://www14.software.ibm.com/cgi-bin/weblap/lap.pl?li_formnum=L-DDIN-AHKPKY&popup=n&title=IBM%20IoT%20for%20Automotive%20Sample%20Starter%20Apps%20%28Android-Mobile%20and%20Server-all%29
 *
 * You may not use this file except in compliance with the license.
 */
import { Component } from '@angular/core';

import { CarStatusDataService } from './summary/car-status-data.service';
import { LocationService, MapArea } from '../shared/location.service';

import { RealtimeDeviceDataProviderService } from '../shared/realtime-device-manager.service';

@Component({
  moduleId: module.id,
  selector: 'fmdash-car-status-page',
  templateUrl: 'car-status-page.component.html',
  providers: [CarStatusDataService],
})
export class CarStatusPageComponent {
}
