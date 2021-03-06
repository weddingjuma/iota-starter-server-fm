/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the IBM License, a copy of which may be obtained at:
 *
 * http://www14.software.ibm.com/cgi-bin/weblap/lap.pl?li_formnum=L-DDIN-AHKPKY&popup=n&title=IBM%20IoT%20for%20Automotive%20Sample%20Starter%20Apps%20%28Android-Mobile%20and%20Server-all%29
 *
 * You may not use this file except in compliance with the license.
 */
var VEHICLE_VENDOR_IBM = "IBM";
module.exports = {
	name: "half_fuel",
	description: "Fuel at half full.",
	fireRule: function(probe, vehicle){
		var alerts = [];
		var fuelLevel = this._getFuelLevel(probe, vehicle);
		var prevFuelLevel = this._getFuelLevel(vehicle.prevProbe, vehicle);
		// half fuel : 10% to 50% of fuel tank
		if((0.1 > prevFuelLevel || prevFuelLevel >= 0.5) && (0.1 <= fuelLevel && fuelLevel < 0.5)){
			var alert = {
					source: {type: "script", id: this.name},
					type: this.name,
					description: this.description,
					severity: "Medium",
					mo_id: probe.mo_id,
					ts: probe.ts,
					latitude: probe.matched_latitude || probe.latitude,
					longitude: probe.matched_longitude || probe.longitude,
					simulated: VEHICLE_VENDOR_IBM === vehicle.vehicleInfo.vendor
				};
			alerts.push(alert);
		}
		return alerts;
	},
	closeRule: function(alert, probe, vehicle){
		var fuelLevel = this._getFuelLevel(probe, vehicle);
		if(0.1 > fuelLevel || fuelLevel > 0.5){
			alert.closed_ts = probe.ts;
			return alert;
		}
	},
	_getFuelLevel: function(probe, vehicle) {
		if (!probe || !probe.props) {
			return;
		}
		if (probe.props.fuelLevel) {
			return probe.props.fuelLevel / 100;
		}
		if (vehicle && vehicle.vehicleInfo && vehicle.vehicleInfo.properties && vehicle.vehicleInfo.properties.fueltank	&& probe.props.fuel) {
			return probe.props.fuel / vehicle.vehicleInfo.properties.fueltank;
		}
		return;
	}
};
