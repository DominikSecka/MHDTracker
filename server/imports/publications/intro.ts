import {Drivers} from "../../../both/collections/drivers.collection";
import {Rides} from "../../../both/collections/rides.collection";
import {RideWarnings} from "../../../both/collections/rideWarnings.collection";
/**
 * Meteor methods to support intro page
 * Created by dominiksecka on 4/24/17.
 */
Meteor.methods({
    /**
     * method gets observable cursor of count of drivers in system
     * @return {Observable<number>}
     */
    'getDriversCount'() {
        return Drivers.find({}).count();
    },

    /**
     * method gets observable cursor of count of rides in system
     * @return {Observable<number>}
     */
    'getRidesCount'(){
        return Rides.find({}).count();
    },

    /**
     * method calculates total distance from all rides
     * @return {number}
     */
    'getTotalDistance'(){
        let distance = 0;
        Rides.find({}).zone().subscribe(rides => {
            rides.forEach(ride => {
                distance += ride.distance;
            });
        });
        return distance;
    },

    /**
     * method calculates duration from all rides
     * @return {number}
     */
    'getTotalDuration'(){
        let duration = 0;
        Rides.find({}).zone().subscribe(rides => {
            rides.forEach(ride => {
                duration += ride.duration;
            });
        });
        return duration;
    },

    /**
     * method gets observable cursor of count of all warnings in system
     * @return {Observable<number>}
     */
    'getWarningsCount'(){
        return RideWarnings.find({}).count();
    }
});