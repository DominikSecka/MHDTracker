/**
 * Created by dominiksecka on 4/21/17.
 */
import {Dispatchers} from "../../../both/collections/dispatchers.collection";

/**
 * Meteor publication of dispatchers collection
 */
Meteor.publish('dispatchers', function() {
    return Dispatchers.find({});
});

/**
 * Meteor methods that works on dispatchers
 */
Meteor.methods({
    /**
     * method that transform dispatchers id to name
     * @param dispatcherId - identifier of dispatcher
     * @return {any}
     */
    'getDispatcherName'(dispatcherId) {
        check(dispatcherId, String);

        if(Dispatchers.findOne({id: dispatcherId}) !== undefined) {
            return {name: Dispatchers.findOne({id: dispatcherId}).name};
        }
        return undefined;
    },

    /**
     * method that checks if dispatcher with specific id exists in system
     * @param dispatcherId - identifier of dispatcher
     * @return {{isDispatcher: boolean}}
     */
    'checkDispatcherExists'(dispatcherId){
        check(dispatcherId, String);

        if(Dispatchers.findOne({id: dispatcherId}) !== undefined){
            return {isDispatcher: true}
        }else{
            return {isDispatcher: false}
        }
    },

    /**
     * method that from dispatcher's identifier returns dispatcher's profile picture url
     * @param dispatcherId - identifier of dispatcher
     * @return {{pictureUrl: string}}
     */
    'getDispatcherPictureUrl'(dispatcherId){
        check(dispatcherId, String);

        if(Dispatchers.findOne({id: dispatcherId}) !== undefined){
            return {pictureUrl: Dispatchers.findOne({id: dispatcherId}).pictureUrl};
        }
    },
    /**
     * method that from dispatcher's identifier returns whole object of specified dispatcher
     * @param dispatcherId - identifier of dispatcher
     * @return {{dispatcher: Dispatcher}}
     */
    'getDispatcherById'(dispatcherId){
        check(dispatcherId, String);

        if(Dispatchers.findOne({id: dispatcherId}) !== undefined){
            return {dispatcher: Dispatchers.findOne({id: dispatcherId})};
        }
    }
});