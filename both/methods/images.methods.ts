/**
 * Created by dominiksecka on 3/8/17.
 */
import { UploadFS } from 'meteor/jalik:ufs';
import { ImagesStore } from '../collections/images.collection';

/**
 *
 * @param data - image source file
 * @returns {Promise<T>} - promise to upload file successfully
 */
export function upload(data: File): Promise<any> {
    return new Promise((resolve, reject) => {
        // pick from an object only: name, type and size
        const file = {
            name: data.name,
            type: data.type,
            size: data.size,
        };

        const upload = new UploadFS.Uploader({
            data,
            file,
            store: ImagesStore,
            onError: reject,
            onComplete: resolve
        });

        upload.start();
    });
}