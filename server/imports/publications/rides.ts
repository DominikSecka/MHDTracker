import {Rides} from "../../../both/collections/rides.collection";
import {Counts} from "meteor/tmeasday:publish-counts";

/**
 * Meteor publication of rides collection for driver statistics
 * Created by dominiksecka on 3/29/17.
 */
Meteor.publish('rides-for-driver', function (driverId: string) {
    Counts.publish(this, 'numberOfRides', Rides.collection.find({driver_id: driverId}), {noReady: true});
    return Rides.find({driver_id: driverId});
});

/**
 * Meteor publication of rides collection
 */
Meteor.publish('rides', function () {
    Counts.publish(this, 'numberOfOnlineRides', Rides.collection.find({}), {noReady: true});
    return Rides.find({});
});

/**
 * Meteor methods for rides collection
 */
Meteor.methods({
    /**
     * method that gets ride specified by ride's identifier
     * @param rideId - ride's identifier
     * @return {Observable<T>}
     */
    'getRide'(rideId: string) {
        check(rideId, String);

        return Rides.find({_id: rideId}).zone();
    },
});