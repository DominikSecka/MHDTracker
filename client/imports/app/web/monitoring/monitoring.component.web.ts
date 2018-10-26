import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import template from './monitoring.component.web.html';
import style from './monitoring.component.web.scss';
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MeteorObservable} from "meteor-rxjs";
import {Observable} from "rxjs";
import {Subscription} from 'rxjs/Subscription';
import {Rides} from "../../../../../both/collections/rides.collection";
import {Ride} from "../../../../../both/models/ride.model";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {WarningModalComponent} from "../sendWarningModal/sendWarning.modal.component.web";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Link} from "../../../../../both/models/link.model";
import {Driver} from "../../../../../both/models/driver.model";

@Component({
    selector: 'monitoring-web',
    template,
    styleUrls: [style],
    providers: [DatePipe]
})

/**
 * component that represents monitoring functionality
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class MonitoringWebComponent implements OnInit, OnDestroy {
    /**
     * map component
     */
    @ViewChild('map') map;
    /**
     * identifier of ride
     * @type {string}
     */
    id: string;
    /**
     * subscription to url parameters
     * @type {Subscription}
     */
    sub: Subscription;
    /**
     * subscription to Meteor rides publication
     * @type {Subscription}
     */
    rideSub: Subscription;
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
     * array that stores names of all tram links
     * @type {[string,string,string,string,string,string,string,string,string,string,string,string,string,string]}
     */
    tramArray: string[] = ['2', '3', '4', '5', '6', '7', '9', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

    /**
     * constructor of MonitoringWebComponent
     *
     * @param route - instance of activated route
     * @param modal - modal dialog handler
     */
    constructor(public route: ActivatedRoute, public modal: Modal) {

    }

    /**
     * function that initializes all subscription
     */
    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.rideSub = MeteorObservable.subscribe('rides').subscribe(() => {
                this.rides = Rides.find({_id: this.id}).zone();
            });

            this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
                this.links = Links.find({}).zone();
            });

            this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
                this.drivers = Drivers.find({_id: Rides.findOne({_id: this.id}).driver_id});
            })
        });
    }

    /**
     * function that destroys all subscriptions
     */
    ngOnDestroy(): void {
        if(this.rideSub) {
            this.rideSub.unsubscribe();
        }
        if(this.linksSub) {
            this.linksSub.unsubscribe();
        }
        if(this.sub) {
            this.sub.unsubscribe();
        }
        if(this.driversSub){
            this.driversSub.unsubscribe();
        }
    }

    /**
     * function that checks if ride monitoring is provided on tram or on bus
     * @param rideLink - name of link
     * @returns {boolean}
     */
    isTramRide(rideLink: string): boolean {
        return this.tramArray.indexOf(rideLink) > -1;
    }

    /**
     * function that handles navigation request to WarningModalComponent
     * @param driverId - driver's identifier of selected driver's warning
     * @returns {Promise<DialogRef<any>>}
     */
    warningClicked(driverId: string){
        let token = Drivers.findOne({_id: driverId},{fields: {token: 1}}).token;
        return this.modal.open(WarningModalComponent, overlayConfigFactory({token: token}, BSModalContext));
    }

    /**
     * function that center map on last known position
     */
    lastKnownPosition(){
        this.map.centerOnLastKnownPosition();
    }
}
