import { CollectionObject } from './collection-object.model';

/**
 * interface of WaypointWarning data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 4/21/17.
 */
export interface WaypointWarning extends CollectionObject{
    /**
     * value of total acceleration
     */
    t_a: number;
    /**
     * value of time stamp from start of monitoring
     */
    t: number;
    /**
     * calculated rating for waypoint
     */
    r: number;
    /**
     * order number of waypoint
     */
    n: number;
    /**
     * WarningLocation object, which stores information about geographical location
     */
    l: WarningLocation;
}

/**
 * interface of WarningLocation data model
 */
export interface WarningLocation extends CollectionObject{
    /**
     * value of altitude for geographical position
     */
    a: number;
    /**
     * value of bearing for geographical position
     */
    b: number;
    /**
     * value of latitude for geographical position
     */
    la: number;
    /**
     * value of longitude for geographical position
     */
    lo: number;
    /**
     * value of speed calculated between last and current geographical position
     */
    s: number;
}