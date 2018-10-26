/**
 * Created by dominiksecka on 3/8/17.
 */
import { Meteor } from 'meteor/meteor';
import { Thumbs, Images } from '../../../both/collections/images.collection';

/**
 * Meteor publication of thumbs of thumbs collection
 */
Meteor.publish('thumbs', function(ids: string[]) {
    return Thumbs.collection.find({
        originalStore: 'images',
        originalId: {
            $in: ids
        }
    });
});

/**
 * Meteor publication of images collection
 */
Meteor.publish('images', function() {
    return Images.collection.find({});
});