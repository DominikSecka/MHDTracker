import { CollectionObject } from './collection-object.model';

/**
 * interface of Dispatcher data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 4/21/17.
 */
export interface Dispatcher extends CollectionObject{
    /**
     * specified unique identifier
     */
    id: string;
    /**
     * full name of dispatcher
     */
    name: string;
    /**
     * e-mail address of dispatcher
     */
    email: string;
    /**
     * unique identifier of dispatcher profile photo
     */
    picture: string;
    /**
     * download url to dispatcher profile photo
     */
    pictureUrl: string;
}