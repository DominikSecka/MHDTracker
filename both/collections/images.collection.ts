/**
 * Created by dominiksecka on 3/8/17.
 */
import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { Thumb, Image } from "../models/image.model";
import { UploadFS } from 'meteor/jalik:ufs';

/**
 *
 * @type {MongoObservable.Collection<Image>} - global constant that represents instance of MongoObservable cursor of images collection
 */
export const Images = new MongoObservable.Collection<Image>('images');
/**
 *
 * @type {MongoObservable.Collection<Thumb>} - global constant that represents instance of MongoObservable cursor of thumbs collection
 */
export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');

/**
 *
 * @type {UploadFS.store.GridFS}
 * global constant that stores function for storing thumbs and information about thumbs in thumbs collection
 */
export const ThumbsStore = new UploadFS.store.GridFS({
    collection: Thumbs.collection,
    name: 'thumbs',
    path: 'uploads/thumbs',

    /**
     *
     * @param from - source file for resizing
     * @param to - destination file for resizing
     * @param fileId - unique identifier of picture
     * @param file
     */
    transformWrite(from, to, fileId, file) {
        const gm = require('gm');

        gm(from, file.name)
            .crop(150, 150, 0, 0)
            .gravity('Center')
            .quality(300)
            .stream()
            .pipe(to);
    }
});

/**
 *
 * @type {UploadFS.store.GridFS}
 * global constant that stores function for storing images and information about images in image collection
 */
export const ImagesStore = new UploadFS.store.GridFS({
    collection: Images.collection,
    name: 'images',
    path: 'uploads/images',
    filter: new UploadFS.Filter({
        contentTypes: ['image/*']
    }),
    copyTo: [
        ThumbsStore
    ]
});