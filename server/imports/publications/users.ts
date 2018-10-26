import {Users} from "../../../both/collections/users.collection";

/**
 * Meteor publication of users collection
 * Created by dominiksecka on 3/16/17.
 */
Meteor.publish('users', function(){
    return Users.find({});
});