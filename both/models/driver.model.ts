import { CollectionObject } from './collection-object.model';

/**
 * interface of Driver data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 2/15/17.
 */
export interface Driver extends CollectionObject{
    /**
     * unique identifier generated by Firebase Authentication provider
     */
    _id: string;
    /**
     * full name od driver
     */
    name: string;
    /**
     * average speed calculated from all rides of driver
     */
    avg_speed: number;
    /**
     * maximum speed calculated from all rides of driver
     */
    max_speed: number;
    /**
     * global rating of driver calculated from all rides
     */
    rating: number;
    /**
     * count of monitored rides for current driver
     */
    no_rides: number;
    /**
     * calculated total distance passed in all driver's rides
     */
    total_distance: number;
    /**
     * totoal duration of monitoring of all driver's rides
     */
    total_duration: number;
    /**
     * date of driver's birthday
     */
    birthday: Date;
    /**
     * identifier of driver's profile photo
     */
    picture?: string;
    /**
     * download url of driver's profile photo
     */
    pictureUrl?: string;
    /**
     * if {true} driver has licence for driving bus, otherwise does not have
     */
    bus?: boolean;
    /**
     * if {true} driver has licence for driving tram, otherwise does not have
     */
    tram?: boolean;
    /**
     * special unique identifier of native android application instance, which driver uses
     */
    token: string;
    /**
     * sex of driver
     */
    sex: string;
    /**
     * e-mail of driver, used to authenticate driver in system
     */
    email: string;
    /**
     * array of achievements that driver achieved
     */
    achievement?: Achievement[];
    /**
     * array of warnings for driver
     */
    warnings?: Warning[];
}

/**
 * interface of Warning data model
 */
export interface Warning extends CollectionObject{
    /**
     * date, when warning was added
     */
    date: Date;
    /**
     * service, in which warning was added
     */
    service: string;
}

/**
 * interface of Achievement data model
 */
export interface Achievement extends CollectionObject{
    /**
     * enumeration identifier of achievement type
     */
    key: string;
    /**
     * date, when driver achieved the achievement
     */
    date: Date;
}



