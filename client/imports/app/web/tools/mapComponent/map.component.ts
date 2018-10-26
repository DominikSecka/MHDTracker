import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from "@angular/core";

import template from "./map.component.html";
import {Waypoints} from "../../../../../../both/collections/waypoints.collection";
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {Counts} from "meteor/tmeasday:publish-counts";
import {Waypoint} from "../../../../../../both/models/waypoint.model";
import {Observable} from "rxjs";
import {RideWarnings} from "../../../../../../both/collections/rideWarnings.collection";
import {RideWarning} from "../../../../../../both/models/rideWarnings.model";

/**
 * constant that specifies default zoom value for google map
 * @type {number}
 */
const DEFAULT_ZOOM = 17;
/**
 * constant that specifies default latitude value for google map
 * @type {number}
 */
const DEFAULT_LAT = 48.6973299;
/**
 * constant that specifies default longitude value for google map
 * @type {number}
 */
const DEFAULT_LNG = 21.0991096;

@Component({
    selector: 'map-mhdtracker',
    template: template,
})

/**
 * component that represents google map functionality for application
 * @implements {AfterViewInit, OnDestroy}
 * Created by dominiksecka on 4/8/17.
 */
export class MapComponent implements AfterViewInit, OnDestroy {
    /**
     * element attribute that specifies ride identifier
     * @type {string}
     */
    @Input() rideId;
    /**
     * element attribute that specifies component height
     * @type {string}
     */
    @Input() height;
    /**
     * element attribute that specifies component width
     * @type {string}
     */
    @Input() width;
    /**
     * element attribute that specifies component top margin
     * @type {string}
     */
    @Input() marginTop;
    /**
     * element attribute that specifies component bottom margin
     * @type {string}
     */
    @Input() marginBottom;
    /**
     * auto run subscription to watch counts of specified filters
     * @type {Subscription}
     */
    autorunSub: Subscription;
    /**
     * subscription to Meteor waypoint publication
     * @type {Subscription}
     */
    waypointsSub: Subscription;
    /**
     * subscription with filter for right warnings to Meteor waypoint publication
     * @type {Subscription}
     */
    rightWarningsSub: Subscription;
    /**
     * subscription with filter for left warnings to Meteor waypoint publication
     * @type {Subscription}
     */
    leftWarningsSub: Subscription;
    /**
     * subscription with filter for acceleration warnings to Meteor waypoint publication
     * @type {Subscription}
     */
    accelerationWarningsSub: Subscription;
    /**
     * subscription with fileter for breaking warnings to Meteor waypoint publciation
     * @type {Subscription}
     */
    breakingWarningsSub: Subscription;
    /**
     * Observable cursor of filtered right warnings collection
     * @type {Observable<RideWarning[]>}
     */
    rightWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of filtered left warnings collection
     * @type {Observable<RideWarning[]>}
     */
    leftWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of filtered acceleration warnings collection
     * @type {Observable<RideWarning[]>}
     */
    accelerationWarnings: Observable<RideWarning[]>;
    /**
     * Observable cursor of filtered breaking warnings collection
     * @type {Observable<RideWarning[]>}
     */
    breakingWarnings: Observable<RideWarning[]>;
    /**
     * count of waypoints in waypoints collection
     * @type {number}
     */
    waypoints_count: number;
    /**
     * Obserbable cursor of waypoints collection
     * @type {Observable<Waypoint[]>}
     */
    waypoints: Observable<Waypoint[]>;
    /**
     * array of waypoints
     * @type {Array}
     */
    waypointArray: Waypoint[];
    /**
     * stores information about last monitored waypoint
     * @type {Waypoint}
     */
    lastWaypoint: Waypoint;
    /**
     * local variable of default latitude for google map
     * @type {number}
     */
    lat: number = DEFAULT_LAT;
    /**
     * local variable of default longitude for google map
     * @type {number}
     */
    lng: number = DEFAULT_LNG;
    /**
     * local variable of default zoom for google map
     * @type {number}
     */
    zoom: number = DEFAULT_ZOOM;
    /**
     * stores instance of google map element
     */
    @ViewChild('map') map;

    /**
     * constructor of MapComponent
     */
    constructor() {

    }

    /**
     * function that initializes all subscriptions for this component
     */
    ngAfterViewInit(): void {
        this.autorunSub = MeteorObservable.autorun().subscribe(() => {
            this.waypoints_count = Counts.get('numberOfWaipoints');
            // console.log(this.waypoints_count);
        });

        this.waypointsSub = MeteorObservable.subscribe('waypoints', this.rideId).subscribe(() => {
            this.waypoints = Waypoints.find({ride_id: this.rideId}, {
                fields: {location: 1, rating: 1},
                sort: {no: 1}
            }).zone();
            this.waypoints.forEach((waypoint) => {
                if (waypoint.length === this.waypoints_count) {
                    this.waypointArray = waypoint;
                    this.lastWaypoint = waypoint[waypoint.length - 1];
                    this.setCenter(this.lastWaypoint.location.latitude, this.lastWaypoint.location.longitude);
                } else if (this.waypoints_count < waypoint.length) {
                    this.setCenter(waypoint[waypoint.length - 1].location.latitude, waypoint[waypoint.length - 1].location.longitude);
                }
            })
        });

        this.rightWarningsSub = MeteorObservable.subscribe('rightwarnings', this.rideId).subscribe(() => {
            this.rightWarnings = RideWarnings.find({key: 'RIGHT_TURN', ride_id: this.rideId}).zone();
        });

        this.leftWarningsSub = MeteorObservable.subscribe('leftwarnings', this.rideId).subscribe(() => {
            this.leftWarnings = RideWarnings.find({key: 'LEFT_TURN', ride_id: this.rideId}).zone();
        });

        this.accelerationWarningsSub = MeteorObservable.subscribe('accelerationwarnings', this.rideId).subscribe(() => {
            this.accelerationWarnings = RideWarnings.find({key: 'BREAKING', ride_id: this.rideId}).zone();
        });

        this.breakingWarningsSub = MeteorObservable.subscribe('breakingwarnings', this.rideId).subscribe(() => {
            this.breakingWarnings = RideWarnings.find({key: 'ACCELERATION', ride_id: this.rideId}).zone();
        });
    }

    /**
     * function that specifies color pf asset for warning by rating
     *
     * @param rating - rating of waypoint
     * @return {any}
     */
    getColorByRatingForWarning(rating: number): string {
        if (rating >= 0 && rating < 15) {
            return 'RED';
        } else if (rating >= 15 && rating < 30) {
            return 'DARKORANGE';
        } else if (rating >= 30 && rating < 50) {
            return 'ORANGE';
        } else if (rating >= 50) {
            return 'YELLOW';
        }
    }

    /**
     * function that removes all subscriptions on destroy of component
     */
    ngOnDestroy(): void {
        if (this.autorunSub) {
            this.autorunSub.unsubscribe();
        }
        if (this.waypointsSub) {
            this.waypointsSub.unsubscribe();
        }
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
    }

    /**
     * function that center map on specified position
     *
     * @param lat - latitude of specified position
     * @param lng - longitude of specified position
     */
    setCenter(lat: number, lng: number): void {
        // console.log(lat);
        // console.log(lng);
        this.lat = lat;
        this.lng = lng;
    }

    /**
     * function that centers map on last known position
     */
    public centerOnLastKnownPosition() {
        // console.log('centering...');
        this.map.this.setCenter(this.lastWaypoint.location.latitude, this.lastWaypoint.location.longitude);
    }

    /**
     * function that specifies color of assets on map
     *
     * @param rating - value of rating of waypoint
     * @returns {string}
     */
    getColorByRating(rating: number): string {
        if (rating >= 90) {
            return 'great'; //#00ff80
        } else if (rating >= 70) {
            return 'good'; //#ffff00
        } else if (rating >= 50) {
            return 'average'; //#ff8000
        }
    }
}