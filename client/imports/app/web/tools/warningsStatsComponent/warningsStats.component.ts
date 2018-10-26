import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {MeteorObservable} from "meteor-rxjs";
import {RideWarnings} from "../../../../../../both/collections/rideWarnings.collection";
import {Counts} from "meteor/tmeasday:publish-counts";
import {RideWarning} from "../../../../../../both/models/rideWarnings.model";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import template from "./warningsStats.component.html";

@Component({
    selector: 'warnings-mhdtracker',
    template: template,
})

/**
 * component that represents warnings statistics
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 4/23/17.
 */
export class WarningsStatsComponent implements OnInit, OnDestroy {
    /**
     * element attribute that specifies ride id
     */
    @Input() ride_id: string;
    /**
     * @type {Subscription}
     */
    autorunSub: Subscription;
    /**
     * subscription of right filtered warnings of Meteor publication
     * @type {Subscription}
     */
    rightWarningsSub: Subscription;
    /**
     * subscription of left filtered warnings of Meteor publication
     * @type {Subscription}
     */
    leftWarningsSub: Subscription;
    /**
     * subscription of acceleration filtered warnings of Meteor publication
     * @type {Subscription}
     */
    accelerationWarningsSub: Subscription;
    /**
     * subscription of breaking filtered warnings of Meteor publication
     * @type {Subscription}
     */
    breakingWarningsSub: Subscription;
    /**
     * Observable cursor of left filtered warnings collection
     * @type {Observable<RideWarning[]>}
     */
    leftWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of right filtered warnings colleciton
     * @type {Observable<RideWarning[]>}
     */
    rightWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of acceleration filtered warnings collection
     * @type {Observable<RideWarning[]>}
     */
    accelerationWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of breaking filtered warnings collection
     * @type {Observable<RideWarning[]>}
     */
    breakingWarnings: Observable<RideWarning[]>;
    /**
     * count of acceleration warnings
     * @type {number}
     */
    accelerWarningCount: number = 0;
    /**
     * count of breaking warnings
     * @type {number}
     */
    breaksWarningCount: number = 0;
    /**
     * count of left warnings
     * @type {number}
     */
    leftWarningCount: number = 0;
    /**
     * count of right warnings
     * @type {number}
     */
    rightWarningCount: number = 0;

    /**
     * constructor of WarningsStatsComponent
     */
    constructor() {

    }

    /**
     * function that initializes all subscriptions
     */
    ngOnInit(): void {
        this.rightWarningsSub = MeteorObservable.subscribe('rightwarnings', this.ride_id).subscribe(() => {
            this.rightWarnings = RideWarnings.find({key: 'RIGHT_TURN', ride_id: this.ride_id}).zone();
        });

        this.leftWarningsSub = MeteorObservable.subscribe('leftwarnings', this.ride_id).subscribe(() => {
            this.leftWarnings = RideWarnings.find({key: 'LEFT_TURN', ride_id: this.ride_id}).zone();
        });

        this.accelerationWarningsSub = MeteorObservable.subscribe('accelerationwarnings', this.ride_id).subscribe(() => {
            this.accelerationWarnings = RideWarnings.find({key: 'BREAKING', ride_id: this.ride_id}).zone();
        });

        this.breakingWarningsSub = MeteorObservable.subscribe('breakingwarnings', this.ride_id).subscribe(() => {
            this.breakingWarnings = RideWarnings.find({key: 'ACCELERATION', ride_id: this.ride_id}).zone();
        });

        this.autorunSub = MeteorObservable.autorun().subscribe(() => {
            this.rightWarningCount = Counts.get('rightTurnCount');
            this.leftWarningCount = Counts.get('leftTurnCount');
            this.accelerWarningCount = Counts.get('accelerationCount');
            this.breaksWarningCount = Counts.get('breakingCount');
            // console.log('right warnings count: ' + this.rightWarningCount);
            // console.log('left warnings count: ' + this.leftWarningCount);
            // console.log('acceleration warnings count: ' + this.accelerWarningCount);
            // console.log('breaking warnings count: ' + this.breaksWarningCount);
        });
    }

    /**
     * function that removes all subscriptions on component destroy
     */
    ngOnDestroy(): void {
        if (this.rightWarningsSub) {
            this.rightWarningsSub.unsubscribe();
        }
        if (this.leftWarningsSub) {
            this.leftWarningsSub.unsubscribe();
        }
        if (this.accelerationWarningsSub) {
            this.accelerationWarningsSub.unsubscribe();
        }
        if (this.breakingWarningsSub) {
            this.breakingWarningsSub.unsubscribe();
        }
        if (this.autorunSub) {
            this.autorunSub.unsubscribe();
        }
    }
}