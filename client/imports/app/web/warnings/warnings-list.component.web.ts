import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";

import template from "./warnings-list.component.web.html";
import style from "./warnings-list.component.web.scss";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {WarningModalComponent} from "../sendWarningModal/sendWarning.modal.component.web";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Route} from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import {MeteorObservable} from "meteor-rxjs";
import {RideWarnings} from "../../../../../both/collections/rideWarnings.collection";
import {RideWarning} from "../../../../../both/models/rideWarnings.model";
import {Ride} from "../../../../../both/models/ride.model";
import {Rides} from "../../../../../both/collections/rides.collection";
import {Http} from "@angular/http";
import {GeocodingService} from "../services/geocoding.service";
import {Subject} from "rxjs/Subject";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Link} from "../../../../../both/models/link.model";
import {Counts} from "meteor/tmeasday:publish-counts";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Driver} from "../../../../../both/models/driver.model";

@Component({
    selector: 'warnings-list',
    template,
    styleUrls: [style]
})

/**
 * component that represents list of warnings
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class WarningsListComponent implements OnInit, OnDestroy{
    /**
     * Observable cursor of warnings collection
     * @type {Observable<RideWarning[]>}
     */
    warnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of rides collection
     * @type {Observable<Ride[]>}
     */
    rides: Observable<Ride[]>;
    /**
     * Observable cursor of links collection
     * @type {Observable<Link[]>}
     */
    links: Observable<Link[]>;
    /**
     * Observable cursor of drivers collection
     * @type {Observable<Driver[]>}
     */
    drivers: Observable<Driver[]>;
    /**
     * subscription to Meteor warnings publication
     * @type {Subscription}
     */
    warningsSub: Subscription;
    /**
     * subscription to Meteor rides publication
     * @type {Subscription}
     */
    ridesSub: Subscription;
    /**
     * subscription to Meteor links publication
     * @type {Subscription}
     */
    linksSub: Subscription;
    /**
     * subscription to Meteor drivers publication
     * @type {Subscription}
     */
    driversSub: Subscription;
    /**
     * auto run subscription to watch count of items in collection
     * @type {Subscription}
     */
    autorunSub: Subscription;
    /**
     * count of warnings
     * @type {number}
     */
    warningsCount: number;
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
     *
     * @param modal - modal dialog handler
     * @param http - http Angular2 client
     * */
    constructor(public modal: Modal, public http: Http) {

    }

    /**
     * function that handles navigation request to WarningmodalComponent
     * @param ride_id - identifier of ride
     */
    warningClicked(ride_id: string) {
        MeteorObservable.call("getDriverTokenByRideId", ride_id).subscribe((response) => {
            // Handle success and response from server!
            // console.log(response);
            this.modal.open(WarningModalComponent, overlayConfigFactory({token: response}, BSModalContext));
        }, (err) => {
            // Handle error
            // console.log(err);
        });
    }

    /**
     * function that provides initialization of all subscription
     */
    ngOnInit(): void {
        this.warningsSub = MeteorObservable.subscribe('ridewarnings').subscribe(() => {
            this.warnings = RideWarnings.find({reviewed: false}).zone();
        });

        this.autorunSub = MeteorObservable.autorun().subscribe(() => {
            this.warningsCount = Counts.get('all-warnings');
            console.log('warning count: ' + this.warningsCount);
        });

        this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
            this.rides = Rides.find({}).zone();
        });

        this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
            this.links = Links.find({}).zone();
        });

        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
            this.drivers = Drivers.find({}, {fields: {_id: 1, name: 1}}).zone();
        });
    }

    /**
     * function that removes all subscriptions on component destroy
     */
    ngOnDestroy(): void {
        if(this.warningsSub) {
            this.warningsSub.unsubscribe();
        }
        if(this.ridesSub){
            this.ridesSub.unsubscribe();
        }
        if(this.linksSub){
            this.linksSub.unsubscribe();
        }
        if(this.driversSub){
            this.driversSub.unsubscribe();
        }
    }

    /**
     * function that handles searching functionality
     * @param value - current value of search input
     */
    searchValueChange(value) {
        let ridesIds = [];
        if(!isNaN(+value)){
            this.rides.subscribe(data => {
                data.forEach(ride => {
                    if(ride.link.match(new RegExp('^'+value)) || ride.service.match(new RegExp('^'+value))){
                        ridesIds.push(ride._id);
                    }
                });
            });
        }else{
            let driversIds = [];
            this.drivers.subscribe(data => {
                data.forEach(driver => {
                    if(driver.name.match(new RegExp(value, 'i'))){
                        driversIds.push(driver._id)
                    }
                })
            });

            let oneLinks = [];
            let zeroLinks = [];
            this.links.subscribe(data => {
                data.forEach(link => {
                    if(this.unicodeToChar(link.oneDirection).match(new RegExp(value, 'i'))){
                        oneLinks.push(link.name);
                    }
                    if(this.unicodeToChar(link.zeroDirection).match(new RegExp(value, 'i'))){
                        zeroLinks.push(link.name);
                    }
                })
            });

            this.rides.subscribe(data => {
                data.forEach(ride => {
                    if(driversIds.indexOf(ride.driver_id) > -1){
                        ridesIds.push(ride._id);
                    }
                    if((oneLinks.indexOf(ride.link) > -1 && ride.direction === true) || (zeroLinks.indexOf(ride.link) > -1 && ride.direction === false)){
                        ridesIds.push(ride._id);
                    }
                })
            });
        }
        this.warningsSub = MeteorObservable.subscribe('ridewarnings').subscribe(() => {
            this.warnings = RideWarnings.find(value ? {$and: [{reviewed: false}, {ride_id: {$in: ridesIds}}]} : {}).zone();
            this.warnings.subscribe(data => this.warningsCount = data.length);
        })
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

    /**
     * function that mark warning as reviewed
     * @param warningId - identifier of warning
     */
    reviewedClicked(warningId: string){
        RideWarnings.update(warningId, {$set: {reviewed: true}});
    }
}

/**
 * path to this component
 * @type {[{path: string; component: WarningsListComponent}]}
 */
export const WarningsListRoutes: Route[] = [{path: 'warnings', component: WarningsListComponent}];