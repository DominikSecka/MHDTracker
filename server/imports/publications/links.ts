import {Links} from "../../../both/collections/links.colleciton";

/**
 * Meteor methods for links collection
 * Created by dominiksecka on 3/31/17.
 */
Meteor.methods({
    /**
     * method transform direction and ride link name to name of finish station
     * @param direction - direction for ride
     * @param rideLink - name of link
     * @return {string}
     */
    'getDirectionName'(direction: boolean, rideLink: string) {
        check(rideLink, String);

        return direction ? Links.findOne({name: rideLink}).oneDirection : Links.findOne({name: rideLink}).zeroDirection;

    },
});

/**
 * Meteor links publication
 */
Meteor.publish('links', function() {
    return Links.find({});
});
