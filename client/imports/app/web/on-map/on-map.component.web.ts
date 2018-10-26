import {Component, OnDestroy, OnInit} from "@angular/core";
import template from "./on-map.component.web.html";
import style from "./on-map.component.web.scss";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {MeteorObservable} from "meteor-rxjs";
import {Rides} from "../../../../../both/collections/rides.collection";
import {Link} from "../../../../../both/models/link.model";
import {Observable} from "rxjs";
import {Ride} from "../../../../../both/models/ride.model";
import {Links} from "../../../../../both/collections/links.colleciton";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {WarningModalComponent} from "../sendWarningModal/sendWarning.modal.component.web";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Driver} from "../../../../../both/models/driver.model";
@Component({
    selector: 'on-map-web',
    template,
    styleUrls: [style]
})

/**
 * component that represents displaying detail data on google map
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class OnMapComponent implements OnInit, OnDestroy {
    /**
     * identifier of ride
     */
    id: string;
    /**
     * subscription to url parms
     * @type {Subscription}
     */
    private sub: Subscription;
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
    driverSub: Subscription;
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
     * stores driver of ride
     * @type {Driver}
     */
    driver: Driver;
    /**
     * array that stores names of all tram links
     * @type {[string,string,string,string,string,string,string,string,string,string,string,string,string,string]}
     */
    tramArray: string[] = ['2', '3', '4', '5', '6', '7', '9', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

    /**
     * constructor of OnMapComponent
     *
     * @param route - instance of activated route
     * @param modal - modal dialog handler
     */
    constructor(public route: ActivatedRoute, public modal: Modal) {
    }

    /**
     * function that initializes subscriptions for this component
     */
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.linksSub = MeteorObservable.subscribe('links').subscribe(() => {
                this.links = Links.find({}).zone();
            });

            this.rideSub = MeteorObservable.subscribe('rides').subscribe(() => {
                this.rides = Rides.find({_id: this.id}).zone();
                this.rides.subscribe(data => {
                    this.driverSub = MeteorObservable.subscribe('drivers').subscribe(() => {
                        this.driver = Drivers.findOne({_id: data[0].driver_id});
                        // console.log(this.driver);
                    });
                });
            });
        });
    }

    /**
     * function that destroys subscription
     */
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.linksSub) {
            this.linksSub.unsubscribe();
        }
        if (this.rideSub) {
            this.rideSub.unsubscribe();
        }
        if (this.driverSub) {
            this.driverSub.unsubscribe();
        }
    }

    /**
     * function that handles navigation request to WarningModalComponent
     * @param driverId - driver's identifier of selected driver's warning
     * @returns {Promise<DialogRef<any>>}
     */
    warningClicked(driverId: string) {
        let token = Drivers.findOne({_id: driverId}, {fields: {token: 1}}).token;
        return this.modal.open(WarningModalComponent, overlayConfigFactory({token: token}, BSModalContext));
    }

    /**
     * function that checks if ride monitoring is provided on tram or on bus
     * @param rideLink - name of link
     * @returns {boolean}
     */
    isTramRide(rideLink: string): boolean {
        return this.tramArray.indexOf(rideLink) > -1;
    }
}
