import {Counts} from "meteor/tmeasday:publish-counts";
import {RideWarnings} from "../../../both/collections/rideWarnings.collection";
/**
 * Meteor publication of filtered not reviewed warnings from warnings collection
 * Created by dominiksecka on 4/21/17.
 */
Meteor.publish('ridewarnings', function () {
    Counts.publish(this, 'all-warnings', RideWarnings.collection.find({reviewed: false}), {noReady: true});
    return RideWarnings.find({reviewed: false});
});

/**
 * Meteor publication of warnings colleciton
 */
Meteor.publish('allwarnings', function () {
    Counts.publish(this, 'full-warnings', RideWarnings.collection.find({}), {noReady: true});
    return RideWarnings.find({});
});

/**
 * Meteor publication of right turning warnings filtered for ride from warnings collection
 */
Meteor.publish('rightwarnings', function (rideId: string) {
    Counts.publish(this, 'rightTurnCount', RideWarnings.collection.find({key: 'RIGHT_TURN', ride_id: rideId}), {noReady: true});
    return RideWarnings.find({key: 'RIGHT_TURN', ride_id: rideId});
});

/**
 * Meteor publication of left turning warnings filtered for ride from warnings collection
 */
Meteor.publish('leftwarnings', function (rideId: string) {
    Counts.publish(this, 'leftTurnCount', RideWarnings.collection.find({key: 'LEFT_TURN', ride_id: rideId}), {noReady: true});
    return RideWarnings.find({key: 'LEFT_TURN', ride_id: rideId});
});

/**
 * Meteor publication of breaking warnings filtered for ride from warnings collection
 */
Meteor.publish('breakingwarnings', function (rideId: string) {
    Counts.publish(this, 'breakingCount', RideWarnings.collection.find({key: 'BREAKING', ride_id: rideId}), {noReady: true});
    return RideWarnings.find({key: 'BREAKING', ride_id: rideId});
});

/**
 * Meteor publication of acceleration warnings filtered for ride from warnings collection
 */
Meteor.publish('accelerationwarnings', function (rideId: string) {
    Counts.publish(this, 'accelerationCount', RideWarnings.collection.find({key: 'ACCELERATION', ride_id: rideId}), {noReady: true});
    return RideWarnings.find({key: 'ACCELERATION', ride_id: rideId});
});