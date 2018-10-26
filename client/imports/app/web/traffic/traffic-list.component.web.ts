import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import template from './traffic-list.component.web.html';
import style from './traffic-list.component.web.scss';
import {Ride} from "../../../../../both/models/ride.model";
import {Rides} from "../../../../../both/collections/rides.collection";
import { Subscription } from 'rxjs/Subscription';
import {MeteorObservable} from "meteor-rxjs";
import {Route} from "@angular/router";
import {Driver} from "../../../../../both/models/driver.model";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Link} from "../../../../../both/models/link.model";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Subject} from "rxjs";
import {Counts} from "meteor/tmeasday:publish-counts";

@Component({
    selector: 'traffic-list',
    template,
    styleUrls: [style]
})

/**
 * component that displays list of online rides
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class TrafficListComponent implements OnInit, OnDestroy {
    /**
     * Observable cursor of rides collection
     * @type {Observable<Ride[]>}
     */
    rides: Observable<Ride[]>;
    /**
     * Observable cursor of drivers collection
     * @type {Observable<Driver[]>}
     */
    drivers: Observable<Driver[]>;
    /**
     * Observable cursor of links collection
     * @type {Observable<Link[]>}
     */
    links: Observable<Link[]>;
    /**
     * subscription to Meteor rides publication
     * @type {Subscription}
     */
    ridesSub: Subscription;
    /**
     * subscription to Meteor drivers publication
     * @type {Subscription}
     */
    driversSub: Subscription;
    /**
     * subscription to Meteor links publication
     * @type {Subscription}
     */
    linksSub: Subscription;
    /**
     * count of online rides
     * @type {number}
     */
    ridesSize: number;
    /**
     * current page instance - stores information of currently selected page
     * @type {Subject<number>}
     */
    curPage: Subject<number> = new Subject<number>();
    /**
     * array that stores names of all tram links
     * @type {Array}
     */
    tramArray: string[] = ['2', '3', '4', '5', '6', '7', '9', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

    /**
     * constructor of TrafficListComponent
     */
    constructor() {
    }

    /**
     * function that provides initialization of all subscription
     */
    ngOnInit() {
        this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
            this.rides = Rides.find({}, {
                sort: {
                    date: -1
                }
            }).zone();
            this.rides.subscribe(data => this.ridesSize = data.length);
        });

        this.driversSub = MeteorObservable.subscribe('drivers-for-ride').subscribe(() => {
            this.drivers = Drivers.find({},{fields: {name: 1}}).zone();
        });

        this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
            this.links = Links.find({}).zone();
            // this.links.subscribe(data => data.forEach(link => this.items.push(this.unicodeToChar(link.oneDirection))))
        });


    }

    /**
     * function that handles searching functionality
     * @param value - current value of search input
     */
    searchValuechange(value) {
        if(!isNaN(+value)){
            this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
                this.rides = Rides.find(value ? {$or: [{link: new RegExp('^'+value)}, {service: {$regex : new RegExp('^'+value)}}] } : {}, {
                    sort:{
                        date: -1
                    }
                }).zone();
                this.rides.subscribe(data => this.ridesSize = data.length);
            });
        }else{
            let drivers = [];
            let oneLinks = [];
            let zeroLinks = [];
            Drivers.find({ name: {$regex : value, $options : 'i'}}, {fields: {_id: 1}}).subscribe(data => data.forEach((driver) => drivers.push(driver._id)));
            this.links.subscribe(data => data.forEach(link => {
                if(this.unicodeToChar(link.oneDirection).match(new RegExp(value, 'i'))){
                    oneLinks.push(link.name);
                }
                if(this.unicodeToChar(link.zeroDirection).match(new RegExp(value, 'i'))){
                    zeroLinks.push(link.name);
                }
            }));
            this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
                this.rides = Rides.find(value ? {$or: [{ driver_id: drivers ? {$in: drivers} : '' }, { $and: [{link: {$in: zeroLinks}}, {direction: false}]}, { $and: [{link: {$in: oneLinks}}, {direction: true}]}]} : {}, {
                    sort:{
                        date: -1
                    }
                }).zone();
                this.rides.subscribe(data => this.ridesSize = data.length);
            })
        }
    }

    /**
     * converter of unicode to string
     * @param text
     * @returns {string}
     */
    unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi,
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
    }

    /**
     * function that removes all subscriptions on component destroy
     */
    ngOnDestroy() {
        if(this.driversSub) {
            this.driversSub.unsubscribe();
        }
        if(this.ridesSub){
            this.ridesSub.unsubscribe();
        }
        if(this.linksSub){
            this.linksSub.unsubscribe();
        }
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
     * function that handles change of page
     * @param page - order number of pages
     */
    onPageChanged(page: number): void {
        this.curPage.next(page);
    }
}

/**
 * path to this component
 * @type {[{path: string; component: TrafficListComponent}]}
 */
export const TrafficListRoutes: Route[] = [{ path: 'traffic', component: TrafficListComponent }];