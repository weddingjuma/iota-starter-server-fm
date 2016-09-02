import { Component, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { OrderByPipe } from '../../utils/order-by.pipe';
import { MomentPipe } from '../../utils/moment.pipe';

@Component({
  moduleId: module.id,
  selector: 'vehicle-list',
  templateUrl: 'vehicle-list.component.html',
  styleUrls: ['//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.min.css', 'vehicle-list.component.css'],
  pipes: [OrderByPipe, MomentPipe]
})

export class VehicleListComponent {
  vehicles: Vehicle[];
  requestSending: boolean;
  orderByKey: string;
  ascendingOrder: boolean;
  numRecInPage: number;
  pageNumber: number;
  hasNext: boolean;
  isWorkingWithVehicle: boolean;
  workingVehicle: Vehicle;

  constructor(private http: Http) {
    this.numRecInPage = 25;
    this.pageNumber = 1;
    this.hasNext = false;
    this.isWorkingWithVehicle = false;
    this.workingVehicle = new Vehicle({});
  }

  ngOnInit() {
    this._getVehicles(1);
  }

  onOrderBy(key) {
    this.ascendingOrder = (key === this.orderByKey) ? !this.ascendingOrder : true;
    this.orderByKey = key;
  }

  // refresh table
  onReload(event) {
    this._getVehicles(1);
  }

  onNumPageChanged(num: number) {
    this.numRecInPage = num;
    this._getVehicles(1);
  }

  onShowPrev(event) {
      if (this.pageNumber > 1) {
        this._getVehicles(this.pageNumber - 1);
      }
  }

  onShowNext(event) {
    if (this.hasNext) {
      this._getVehicles(this.pageNumber + 1);
    }
  }

  // activate or deactivate given vehicle
  onActivate(mo_id: string, toActivate: boolean) {
    let vehicle = this._getVehicle(mo_id);
    if (!vehicle) {
      alert("There is no such a vehicle.");
      return;
    }

    // Change vehicle state
    let data = vehicle.getData();
    data["status"] = toActivate ? "Active" : "Inactive";

    this._updateVehicle(mo_id, new Vehicle(data));
  }

  // Open a vehicle dialog for creating
  onCreate() {
    this.workingVehicle = new Vehicle({});
    this.isWorkingWithVehicle = true;
  }

  // Open a vehicle dialog for updating
  onUpdate(mo_id: string) {
    this.workingVehicle = this._getVehicle(mo_id);
    this.isWorkingWithVehicle = true;
  }

    // Create a vehicle
  onSubmitVehicle() {
    this.isWorkingWithVehicle = false;
    if (this.workingVehicle.mo_id) {
      this._updateVehicle(this.workingVehicle.mo_id, this.workingVehicle);
    } else {
      this._createNewVehicle(this.workingVehicle);
    }
  }

  // Cancel a vehicle creation
  onCancelVehicle() {
    this.isWorkingWithVehicle = false;
  }

  // Delete given vehicle
  onDelete(mo_id: string) {
    this.requestSending = true;
    this.http.delete("/user/vehicle/" + mo_id)
    .subscribe((response: Response) => {
      if (response.status === 200) {
        // Update vehicle list when succeeded
        this._getVehicles(1);
      }
      this.requestSending = false;
    }, (error: any) => {
      this.requestSending = false;
    });
  }

  // Create a vehicle with given data
  private _createNewVehicle(vehicle: Vehicle) {
    // remove internally used property
    let url = "/user/vehicle";
    let body = JSON.stringify({vehicle: vehicle.getData()});
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});

    this.requestSending = true;
    this.http.post(url, body, options)
    .subscribe((response: Response) => {
      if (response.status === 200) {
        // Update vehicle list when succeeded
        this._getVehicles(1);
      }
      this.requestSending = false;
    }, (error: any) => {
      this.requestSending = false;
    });
  }

  private _getVehicle(mo_id: string): Vehicle {
    for (let i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].mo_id === mo_id) {
        return this.vehicles[i];
      }
    }
    return null;
  }

  private _updateVehicle(mo_id: string, vehicle: Vehicle) {
    vehicle.mo_id = mo_id;
    let url = "/user/vehicle/" + mo_id;
    let body = JSON.stringify(vehicle.getData());
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});

    this.requestSending = true;
    this.http.put(url, body, options)
    .subscribe((response: Response) => {
      if (response.status === 200) {
        // Update vehicle list when succeeded
        this._getVehicles(this.pageNumber);
      }
      this.requestSending = false;
    }, (error: any) => {
      this.requestSending = false;
    });
  }

  // Get vehicle list from server and update table
  private _getVehicles(pageNumber: number) {
    this.requestSending = true;
    let url = "/user/vehicle?num_rec_in_page=" + this.numRecInPage + "&num_page=" + pageNumber;
    this.http.get(url)
    .subscribe((response: Response) => {
      if (response.status === 200) {
        let resJson = response.json();
        this.vehicles = resJson && resJson.data.map(function(v) {
            return new Vehicle(v);
        });
        this.pageNumber = pageNumber;
        this.hasNext = this.numRecInPage <= this.vehicles.length;
      }
      this.requestSending = false;
    }, (error: any) => {
      if (error.status === 400) {
        alert("Thre are no more vehicles.");
      }
      this.hasNext = false;
      this.requestSending = false;
    });
  }
}

// Vehicle definition
class Vehicle {
  __id: string;
  mo_id: string; // The ID of the vehicle that is automatically generated by the system.
  internal_mo_id: number; // The numerical ID of the vehicle that is automatically generated by the system.
  vendor: string = ""; // The vendor ID of the vehicle that is created from within the vendor's system.
  model: string = ""; // The model of the vehicle.
  type: string = ""; // The type of the vehicle. = [ArticulatedTruck,CarWithTrailer,HighSidedVehicle,PassengerCar,Motorcycle,Bus,LightTruck,HeavyTruck,HeavyTruck_AC2,HeavyTruck_AC3,HeavyTruck_AC4,HeavyTruck_AC5,HeavyTruck_AC6,HeavyTruck_AC7,TruckWithTrailer,TruckWithTrailer_AC2,TruckWithTrailer_AC3,TruckWithTrailer_AC4,TruckWithTrailer_AC5,TruckWithTrailer_AC6,TruckWithTrailer_AC7,Unknown]
  serial_number: string = ""; // The serial number of the vehicle.
  usage: string = ""; //  The usage code of the vehicle. = [PrivateUse,Taxi,Commercial,PublicTransport,Emergency,PatrolServices,RoadOperator,SnowPlough,HazMat,Other,Unknown]
  description: string = ""; // Description of the vehicle.
  width: number; // The width of the vehicle.
  height: number; // The height of the vehicle.
  driver_id: string; // The driver ID that is created by the driver interface from within the vehicle.
  status: string = "Inactive";
  properties: any;

  constructor(props) {
    for (let key in props) {
      this[key] = props[key];
    }
    this.__id = this.serial_number || this.mo_id;
  }

  getData() {
    let data = {};
    for (let key in this) {
      if (key.lastIndexOf("__", 0) !== 0) {
        data[key] = this[key];
      }
    }
    return data;
  }
}
