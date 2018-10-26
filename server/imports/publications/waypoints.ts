import {Waypoints} from "../../../both/collections/waypoints.collection";
import {Counts} from "meteor/tmeasday:publish-counts";

/**
 * Meteor publication of filtered waypoints for ride from waypoint collection
 * Created by dominiksecka on 3/29/17.
 */
Meteor.publish('waypoints', function(rideId: string) {
    Counts.publish(this, 'numberOfWaipoints', Waypoints.collection.find({ride_id: rideId}), { noReady: true });
    return Waypoints.find({ride_id: rideId});
});
