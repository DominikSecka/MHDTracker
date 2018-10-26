/**
 * interface of Image data model, stores information about inserted images inserted in system
 *
 * Created by dominiksecka on 3/8/17.
 */
export interface Image {
    /**
     * unique identifier for image data object
     */
    _id?: string;
    /**
     * check if image is complete
     */
    complete: boolean;
    /**
     * format of image
     */
    extension: string;
    /**
     * name of image
     */
    name: string;
    /**
     * progress in storing image
     */
    progress: number;
    /**
     * data size of image
     */
    size: number;
    /**
     *
     */
    store: string;
    /**
     *
     */
    token: string;
    /**
     *
     */
    type: string;
    /**
     * date of image uploading
     */
    uploadedAt: Date;
    uploading: boolean;
    /**
     * url of local service, where is image stored
     */
    url: string;
    /**
     * id of user, who is owner of this image
     */
    userId?: string;
}

/**
 * interface of Thumb data model
 * @extends {Image}
 */
export interface Thumb extends Image  {
    /**
     * identifier of original store of this image
     */
    originalStore?: string;
    /**
     * identifier of original image
     */
    originalId?: string;
}