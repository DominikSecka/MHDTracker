/**
 * Created by dominiksecka on 3/13/17.
 */
import {Drivers} from "../../../both/collections/drivers.collection";
import { Counts } from 'meteor/tmeasday:publish-counts';
import {Rides} from "../../../both/collections/rides.collection";
import * as admin from "firebase-admin";

let serviceAccount = require("./mhdtracker-c3fd3-firebase-adminsdk-kxbqf-893e7ebcdb.json");

/**
 * initialization of admin firebase functionality
 */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mhdtracker-c3fd3.firebaseio.com"
});

/**
 * Meteor publication of drivers collection
 */
Meteor.publish('drivers', function(searchSrting: string) {
    Counts.publish(this, 'numberOfDrivers', Drivers.collection.find(), { noReady: true });
    return Drivers.find();
});

/**
 * Meteor publication of drivers for ride list
 */
Meteor.publish('drivers-for-ride', function() {
    return Drivers.find({});
});

/**
 * meteor publication for drivers info from collection
 */
Meteor.publish('drivers-info', function() {
    return Drivers.find({});
});

/**
 * Meteor methodst on server side
 */
Meteor.methods({
    /**
     * method that gets driver's name by identifier of driver
     * @param driverId - identifier of driver
     * @return {any}
     */
    'getDriverName'(driverId) {
        check(driverId, String);

        if(Drivers.findOne({_id: driverId}) !== undefined){
            return {name: Drivers.findOne({_id: driverId}).name};
        }
        return undefined;
    },

    /**
     * method that deletes specified driver
     * @param driverId - identifier of driver
     */
    'deleteDriver'(driverId){
        check(driverId, String);
        admin.auth().deleteUser(driverId).then((success) => console.log(success)).catch(error => console.log(error));
    },

    /**
     * method that gets driver's unique token by ride id
     * @param rideId - identifier of ride
     * @return {string}
     */
    'getDriverTokenByRideId' (rideId){
        check(rideId, String);

        return Drivers.findOne({_id: Rides.findOne({_id: rideId}).driver_id}).token;
    },

    /**
     * method that checks if driver exists in system by driver id
     * @param driverId - identifier of driver
     * @return {{isDriver: boolean}}
     */
    'checkDriverExists'(driverId){
        check(driverId, String);

        if(Drivers.findOne({_id: driverId}) !== undefined){
            return {isDriver: true}
        }else{
            return {isDriver: false}
        }
    },

    /**
     * method that checks if ride belongs to specified driver
     * @param driverId - identifier of driver
     * @param rideId - identifier of ride
     * @return {{rideBelongs: boolean}}
     */
    'checkRideBelongsToDriver' (driverId, rideId){
        check(driverId, String);
        check(rideId, String);

        if(Rides.findOne({_id: rideId, driver_id: driverId})) {
            return {rideBelongs: true};
        }else{
            return {rideBelongs: false};
        }
    }
});