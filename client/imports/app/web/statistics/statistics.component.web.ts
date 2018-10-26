import {Component, OnInit, OnDestroy} from '@angular/core';

import template from './statistics.component.web.html';
import style from './statistics.component.web.scss';
import {ActivatedRoute} from "@angular/router";


import {Observable} from "rxjs";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Driver} from "../../../../../both/models/driver.model";
import {Ride} from "../../../../../both/models/ride.model";
import {Rides} from "../../../../../both/collections/rides.collection";
import { Subscription } from 'rxjs/Subscription';
import {MeteorObservable} from "meteor-rxjs";
import {Counts} from "meteor/tmeasday:publish-counts";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Link} from "../../../../../both/models/link.model";
import {EditDriverModalComponent} from "../editDriverModal/editDriver.modal.component.web";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {DriverSettingsModalComponent} from "../driverSettingsModal/driverSettings.modal.component.web";

@Component({
    selector: 'statistics-web',
    template,
    styleUrls: [style]
})

/**
 * component that provides displaying of specified driver statistics
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class StatisticsWebComponent implements OnInit, OnDestroy {
    /**
     * driver's identifier
     * @type {string}
     */
    id: string;
    /**
     * subscription to url parameters
     * @type {Subscription}
     */
    private sub: Subscription;
    /**
     * stores Driver object with all needed information
     * @type {Driver}
     */
    driver: Driver;
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
     * viewing state
     * @type {boolean}
     */
    show: boolean = false;
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
     * autorun subscription to handle count of items in collections
     * @type {Subscription}
     */
    autorunSub: Subscription;
    /**
     * stores count of rides for driver
     * @type {number}
     */
    rides_count: number;
    /**
     * stores type of user
     * @type {string}
     */
    user: string = "dispatcher";
    /**
     * array that stores names of all tram links
     * @type {Array}
     */
    tramArray: string[] = ['2', '3', '4', '5', '6', '7', '9', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];
    /**
     * array that stores all keys of achievements
     * @type {Array}
     */
    achievements: string[] = ['BIRTHDAY_WORKING', 'FIVE_RIDES_PROGRESS', 'FIVE_STAR_RIDE', 'GREAT_HUNDRED', 'GREAT_TEN', 'THOUSAND_WORKING_HOURS'];
    /**
     * array that stores only achieved achievements of driver
     * @type {Array}
     */
    achieved: string[] = [];

    /**
     * constructor of StatisticsWebComponent
     *
     * @param modal
     * @param route
     */
    constructor(public modal: Modal, private route: ActivatedRoute) {}

    /**
     * function that initializes component and all needed subscriptions
     */
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.user = params['driver'];
            this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
                Drivers.find({_id: this.id}).subscribe({
                    next: drivers => {
                        // console.log("Got drivers: ", drivers);
                        this.driver = drivers[0];
                        if(this.driver.achievement) {
                            this.driver.achievement.forEach((achievement) => {
                                this.achieved.push(achievement.key);
                            });
                        }
                    }
                });
            });
        });

        this.ridesSub = MeteorObservable.subscribe('rides-for-driver', this.id).subscribe(() => {
            this.rides = Rides.find({driver_id: this.id}, {sort: {date: -1}}).zone();
            this.rides.subscribe(data => this.rides_count = data.length);
        });

        this.autorunSub = MeteorObservable.autorun().subscribe(() => {
            this.rides_count = Counts.get('numberOfRides');
            // console.log(this.rides_count);
        });

        this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
            this.links = Links.find({}).zone();
        });

        this.rides_count = 0;

        this.show = true;
    }

    /**
     * function that provides search functionality
     * @param value - current value of search input
     */
    searchValueChange(value) {
        if(!isNaN(+value)){
            this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
                this.rides = Rides.find({$and: [{$or: [{link: new RegExp('^'+value)}, {service: {$regex : new RegExp('^'+value)}}]}, {driver_id: this.driver._id}]}, {
                    sort:{
                        date: -1
                    }
                }).zone();
                this.rides.subscribe(data => this.rides_count = data.length);
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
                this.rides = Rides.find({$and: [{$or: [{ driver_id: drivers ? {$in: drivers} : '' }, { $and: [{link: {$in: zeroLinks}}, {direction: false}]}, { $and: [{link: {$in: oneLinks}}, {direction: true}]}]}, {driver_id: this.driver._id}]}, {
                    sort:{
                        date: -1
                    }
                }).zone();
                this.rides.subscribe(data => this.rides_count = data.length);
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
     * function that destroys all subscriptions
     */
    ngOnDestroy() {
        if(this.ridesSub) {
            this.ridesSub.unsubscribe();
        }
        if(this.linksSub) {
            this.linksSub.unsubscribe();
        }
        if(this.autorunSub) {
            this.autorunSub.unsubscribe();
        }
        if(this.driversSub) {
            this.driversSub.unsubscribe();
        }
        if(this.sub) {
            this.sub.unsubscribe();
        }
    }

    /**
     * function that handles navigation request to EditDriverModalComponent
     */
    editDriver(){
        this.modal.open(EditDriverModalComponent, overlayConfigFactory({ driver: this.driver }, BSModalContext));
    }

    /**
     * function that handles navigation request to DriverSettingsModalComponent
     */
    settingsClicked(){
        this.modal.open(DriverSettingsModalComponent, overlayConfigFactory({ driver: this.driver }, BSModalContext));
    }

    /**
     * function that check which achievements are achieved
     *
     * @param achievement
     * @returns {boolean}
     */
    checkAchieved(achievement: string){
        return !(this.achieved.indexOf(achievement) > -1);
    }

    /**
     * function that check if ride monitoring is provided on tram or on bus
     *
     * @param rideLink
     * @returns {boolean}
     */
    isTramRide(rideLink: string): boolean{
        return this.tramArray.indexOf(rideLink) > -1;
    }
}