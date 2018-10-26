import {Component, OnDestroy, OnInit} from "@angular/core";

import template from "./introPage.component.web.html";
import style from "./introPage.component.web.scss";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {Subscription} from "rxjs/Subscription";
import {MeteorObservable} from "meteor-rxjs";
import {Observable} from "rxjs/Observable";
import {Counts} from "meteor/tmeasday:publish-counts";
import {Rides} from "../../../../../both/collections/rides.collection";
import {Ride} from "../../../../../both/models/ride.model";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {LoginChooseModalComponent} from "../loginChooseModal/loginChoose.modal.component.web";
import {RegisterModalComponent} from "../registerModal/register.modal.component.web";
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {ToasterService} from "angular2-toaster";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {RideWarnings} from "../../../../../both/collections/rideWarnings.collection";

@Component({
    selector: 'intro-page-web',
    template,
    styleUrls: [style],
})

/**
 * component that provides functionality of intro page
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 4/21/17.
 */
export class IntroPageComponent implements OnInit, OnDestroy {
    /**
     * count of registered drivers
     * @type {number}
     */
    driversCount: number = 0;
    /**
     * count of total monitored rides
     * @type {number}
     */
    ridesCount: number = 0;
    /**
     * total distance from all monitored rides
     * @type {number}
     */
    totalDistance: number = 0;
    /**
     * total time from all monitored rides
     * @type {string}
     */
    totalTime: string = "0m 0d 00:00:00";
    /**
     * total count of warnings
     * @type {number}
     */
    totalWarnings: number = 0;
    /**
     * average rating from all rides
     * @type {number}
     */
    averageRating: number = 0;
    /**
     * subscription to Meteor drivers publication
     * @type {Subscription}
     */
    driversSub: Subscription;
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
     * subscription for average rating calculation
     * @type {Subscription}
     */
    averageRatingSub: Subscription;
    /**
     * Observable cursor of rides collection
     * @type {Observable<Ride[]>}
     */
    rides: Observable<Ride[]>;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    toasterService: ToasterService;


    /**
     * constructor of IntroPageComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public modal: Modal, public af: AngularFire, private router: Router) {
        this.toasterService = toasterService;
    }

    /**
     * function that initializes of all subscriptions on init of component
     */
    ngOnInit(): void {
        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
           Drivers.find({}, {}).zone().subscribe(data => this.driversCount = data.length);
        });
        this.warningsSub = MeteorObservable.subscribe('allwarnings').subscribe(() => {
            RideWarnings.find({}, {}).zone().subscribe(data => this.totalWarnings = data.length);
        });
        this.ridesSub = MeteorObservable.subscribe('rides').subscribe(() => {
            this.rides = Rides.find({distance: {$exists: true}});
            this.rides.subscribe(data => this.ridesCount = data.length);
            this.rides.map(arr => arr.reduce((a, b) => (a + b.distance), 1)).subscribe(sum => {
                this.totalDistance = sum / 1000;
            });
            this.rides.map(arr => arr.reduce((a, b) => (a + b.duration), 1)).subscribe(sum => {
                let date = new Date(sum);
                let str = '';
                str += date.getUTCMonth() + "m ";
                str += date.getUTCDate() - 1 + "d ";
                str += date.getUTCHours() + ":";
                str += date.getUTCMinutes() + ":";
                str += date.getUTCSeconds() + ".";
                str += date.getUTCMilliseconds();
                this.totalTime = str;
            });
            const initialValue = {sum: 0, count: 0};
            const avg = this.rides.map(arr => arr.reduce((prev, cur) => {
                return {
                    sum: prev.sum + cur.rating,
                    count: prev.count + 1
                }
            }, initialValue)).map(o => o.sum / o.count);

            this.averageRatingSub = avg.subscribe(averageRating => {
                // console.log('Average rating is: ', averageRating);
                this.averageRating = averageRating;
            });
        });
    }

    /**
     * function that destroys all subscriptions in this component
     */
    ngOnDestroy(): void {
        if (this.driversSub) {
            this.driversSub.unsubscribe();
        }
        if (this.ridesSub) {
            this.ridesSub.unsubscribe();
        }
        if (this.warningsSub) {
            this.warningsSub.unsubscribe();
        }
        if (this.averageRatingSub) {
            this.averageRatingSub.unsubscribe();
        }
    }

    /**
     * function that handles navigation request to LoginChooseModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    loginClicked() {
        return this.modal.open(LoginChooseModalComponent, overlayConfigFactory({data: []}, BSModalContext));
    }

    /**
     * function that handles navigation request to RegisterModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    registerClicked() {
        return this.modal.open(RegisterModalComponent, overlayConfigFactory({backComponent: "intro"}, BSModalContext));
    }

    /**
     * function that handles entry point to application with saved credentials
     */
    enterClicked() {
        let sub = this.af.auth.subscribe(auth => {
            if (auth) {
                this.router.navigateByUrl('/dispatching');
            } else {
                this.toasterService.pop({type: 'error', title: '', body: 'Prihláste sa, prosím!', toastContainerId: 1});
                sub.unsubscribe();
            }
        });
    }
}