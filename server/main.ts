import { Meteor} from 'meteor/meteor';
import './imports/publications/images';

import { loadDrivers } from './imports/fixtures/drivers';

import './imports/publications/drivers';
import './imports/publications/users';
import './imports/publications/waypoints';
import './imports/publications/rides';
import './imports/publications/links';
import './imports/publications/settings';
import './imports/publications/rideWarnings';
import './imports/publications/dispatchers';
import './imports/publications/intro';

/**
 * meteor server startup function
 * Created by dominiksecka on 2/16/17.
 */
Meteor.startup(() => {
    // loadDrivers();
    WebApp.rawConnectHandlers.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    })
});
