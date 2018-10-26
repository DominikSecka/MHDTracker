import {Component, OnDestroy, OnInit} from "@angular/core";
import { ViewController, Platform} from "ionic-angular";
import { Geolocation } from 'ionic-native';
import { Observable, Subscription } from 'rxjs';

import template from './onMap.component.mobile.html'
import style from './onMap.component.mobile.css'

/**
 * constant, that stores default value of zoom for google map
 * @type {number}
 */
const DEFAULT_ZOOM = 5;
/**
 * constant, that stores default value of equator for google map
 * @type {number}
 */
const EQUATOR = 40075004;
/**
 * constant, that stores default value of  latitude for google map
 * @type {number}
 */
const DEFAULT_LAT = 48.6973299;
/**
 * constant, that stores default value of longitude for google map
 * @type {number}
 */
const DEFAULT_LNG = 21.0991096;
/**
 * constant, that stores default value for location refresh interval
 * @type {number}
 */
const LOCATION_REFRESH_INTERVAL = 500;

@Component({
    selector: 'on-map',
    template,
    styleUrls: [style]
})

/**
 * component for display data on map
 * @implements OnInit, OnDestroy
 * Created by dominiksecka on 2/21/17.
 */
export class OnMapComponent  implements OnInit, OnDestroy{

    /**
     * local variable of latitude value for google map
     * @type {number}
     */
    lat: number = DEFAULT_LAT;
    /**
     * local variable of longitude value for google map
     * @type {number}
     */
    lng: number = DEFAULT_LNG;
    /**
     * local variable of zoom value for google map
     * @type {number}
     */
    zoom: number = DEFAULT_ZOOM;
    /**
     * local variable of accuracy for google map
     * @type {number}
     */
    accuracy: number = -1;
    /**
     * subscription of specific refresh rate
     */
    intervalObs: Subscription;

    constructor(private platform: Platform, private viewCtrl: ViewController) {

    }

    /**
     * function, that is called on initialization of this component
     */
    ngOnInit() {
        // Refresh location at a specific refresh rate
        this.intervalObs = this.reloadLocation()
            .flatMapTo(Observable
                .interval(LOCATION_REFRESH_INTERVAL)
                .timeInterval())
            .subscribe(() => {
                this.reloadLocation();
            });
    }

    /**
     * function, that frees subscriptions on destroy of this component
     */
    ngOnDestroy() {
        // Dispose subscription
        if (this.intervalObs) {
            this.intervalObs.unsubscribe();
        }
    }

    /**
     * function, that calculates zoom by accuracy
     *
     * @param accuracy - accuracy of gps
     * @returns {number}
     */
    calculateZoomByAccuracy(accuracy: number): number {
        // Source: http://stackoverflow.com/a/25143326
        const deviceHeight = this.platform.height();
        const deviceWidth = this.platform.width();
        const screenSize = Math.min(deviceWidth, deviceHeight);
        const requiredMpp = accuracy / screenSize;

        return ((Math.log(EQUATOR / (256 * requiredMpp))) / Math.log(2)) + 1;
    }

    /**
     * function that reload current location displayed on map
     * @returns {any}
     */
    reloadLocation() {
        return Observable.fromPromise(Geolocation.getCurrentPosition().then((position) => {
            if (this.lat && this.lng) {
                // Update view-models to represent the current geo-location
                this.accuracy = position.coords.accuracy;
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.zoom = this.calculateZoomByAccuracy(this.accuracy);
            }
        }));
    }
}