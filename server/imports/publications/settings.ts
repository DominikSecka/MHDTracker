import {SettingsCollection} from "../../../both/collections/settings.collection";

/**
 * Meteor publication of settings collection
 * Created by dominiksecka on 4/21/17.
 */
Meteor.publish('settings', function () {
    return SettingsCollection.find({}, {sort: {version: -1}});
});