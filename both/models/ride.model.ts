import { CollectionObject } from './collection-object.model';

/**
 * interface for Ride data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 3/28/17.
 */
export interface Ride extends CollectionObject{
    /**
     * identifier of driver for the ride
     */
    driver_id: string;
    /**
     * if {true} monitoring is provided in bus
     */
    bus: boolean;
    /**
     * if {true} monitoring is provided in tram
     */
    tram: boolean;
    /**
     * date of monitoring
     */
    date: Date;
    /**
     * link name
     */
    link: string;
    /**
     * if {true} direction represents oneDirection in Link data model, otherwise represents zeroDirection in Link data model
     */
    direction: boolean;
    /**
     * unique code of service
     */
    service: string;
    /**
     * calculated average speed for ride
     */
    avg_speed: number;
    /**
     * calculated maximum speed for ride
     */
    max_speed: number;
    /**
     * calculated rating in percent for ride
     */
    rating: number;
    /**
     * total distance reached in monitoring session
     */
    distance: number;
    /**
     * total duration reached in monitoring session
     */
    duration: number;
    /**
     * if {true} ride is online and monitoring is in progress, otherwise connection is no available
     */
    online: boolean;
    /**
     * if {true} ride is finished, otherwise ride is in progress
     */
    finished: boolean;
}