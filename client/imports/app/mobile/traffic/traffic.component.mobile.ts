import { Component } from '@angular/core';

import template from './traffic.component.mobile.html'
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Observable} from "rxjs";
import {Driver} from "../../../../../both/models/driver.model";
import {NavController} from "ionic-angular";
import {MonitoringComponent} from "../monitoring/monitoring.component.mobile";
import {OnMapComponent} from "../onMap/onMap.component.mobile";
import {MeteorObservable} from "meteor-rxjs";
import {Rides} from "../../../../../both/collections/rides.collection";
import {Counts} from "meteor/tmeasday:publish-counts";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Ride} from "../../../../../both/models/ride.model";
import {Link} from "../../../../../both/models/link.model";
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'tab-traffic',
    template
})

/**
 * component for displaying actually monitored apps
 *
 * Created by dominiksecka on 2/16/17.
 */
export class TrafficComponent{
    /**
     * observable cursor of filtered drivers collection
     * @type {Observable<Driver[]>}
     */
    drivers: Observable<Driver[]>;
    /**
     * observable cursor of filtered rides collection
     * @type {Observable<Ride[]>}
     */
    rides: Observable<Ride[]>;
    /**
     * observable cursor of filtered links collection
     * @type {Observable<Link[]>}
     */
    links: Observable<Link[]>;
    /**
     * stores subscription function for Meteor rides publication
     * @type {Subscription}
     */
    ridesSub: Subscription;
    /**
     * stores subscription function for Meteor drivers publication
     * @type {Subscription}
     */
    driversSub: Subscription;
    /**
     * stores subscription function for Meteor links publication
     * @type {Subscription}
     */
    linksSub: Subscription;

    /**
     * array that stores names of all tram links
     * @type {[string,string,string,string,string,string,string,string,string,string,string,string,string,string]}
     */
    tramArray: string[] = ['2', '3', '4', '5', '6', '7', '9', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

    /**
     * constructor of TrafficComponent
     * @param navCtrl - navigation controller for mobile app
     */
    constructor(public navCtrl: NavController) {
        this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
            this.rides = Rides.find({}, {
                sort: {
                    date: -1
                }
            }).zone();
        });

        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
            this.drivers = Drivers.find({},{fields: {name: 1}}).zone();
        });

        this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
            this.links = Links.find({}).zone();
            // this.links.subscribe(data => data.forEach(link => this.items.push(this.unicodeToChar(link.oneDirection))))
        });
    }

    /**
     * converter of unicode to string
     * @param text
     * @returns {string}
     */
    unicodeToChar(text: string) {
        return text.replace(/\\u[\dA-F]{4}/gi,
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
    }

    /**
     * validating function that ride is provided on tram
     * @param rideLink
     * @returns {boolean}
     */
    isTramRide(rideLink: string): boolean{
        return this.tramArray.indexOf(rideLink) > -1;
    }

    /**
     * handler for search input
     * @param event - event of changing input in search
     */
    onInput(event): void{
        //this.drivers = Drivers.find(event.target.value ? { name: {$regex : event.target.value}} : {}).zone();
    }

    /**
     * function that handles navigation request to MonitoringComponent
     */
    monitoringClicked(){
        this.navCtrl.push(MonitoringComponent);
    }

    /**
     * function that handles navigation request to OnMapComponent
     */
    onMapClicked(){
        this.navCtrl.push(OnMapComponent);
    }

    /**
     * function, which refreshes the list view of online rides
     *
     * @param refresher - instance of refresher
     */
    doRefresh(refresher) {
        // console.log('Begin async operation', refresher);

        setTimeout(() => {
            // console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
