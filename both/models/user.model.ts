import { CollectionObject } from './collection-object.model';
import {Driver} from "./driver.model";

/**
 * interface for User data mode, part of old solution
 * @extends {CollectionObject}
 * Created by dominiksecka on 3/13/17.
 */
export interface User extends CollectionObject{
    /**
     * identifier of users collection
     */
    _id: string;
    /**
     * array of drivers registered in system
     */
    drivers: Driver[];
}