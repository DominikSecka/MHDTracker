import {CollectionObject} from "./collection-object.model";

/**
 * interface of Waypoint data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 3/28/17.
 */
export interface Waypoint extends CollectionObject{
    /**
     * identifier of ride, to which waypoint belongs
     */
    ride_id: string;
    /**
     * order number for waypoint
     */
    no: number;
    /**
     * calculated rating for waypoint
     */
    rating: number;
    /**
     * time stamp from beginning of monitoring
     */
    timestamp: number;
    /**
     * total acceleration, calculated from accelerations from different axis
     */
    total_acceleration: number;
    /**
     * level of acceleration
     */
    acceleration_level: number;
    /**
     * Acceleration object, with data from accelerometer sensor
     */
    acceleration: Acceleration;
    /**
     *Gyro object, with data from gyroscope sensor
     */
    gyro: Gyro;
    /**
     * MyLocation object, with data form gps sensor
     */
    location: MyLocation;
}

/**
 * interface of Acceleration data model
 */
export interface Acceleration extends CollectionObject{
    /**
     * value of acceleration in x axis
     */
    accX: number;
    /**
     * value of acceleration in y axis
     */
    accY: number;
    /**
     * value of acceleration in z axis
     */
    accZ: number;
}

/**
 * interface of Gyro data model
 */
export interface Gyro extends CollectionObject{
    /**
     * value of gyroscope rotation in x axis
     */
    gyroX: number;
    /**
     * value of gyroscope rotation in y axis
     */
    gyroY: number;
    /**
     * value of gyroscope rotation in z axis
     */
    gyroZ: number;
}

/**
 * interface of MyLocation data model
 */
export interface MyLocation extends CollectionObject{
    /**
     * altitude of geographical position
     */
    altitude: number;
    /**
     * bearing in geographical position
     */
    bearing: number;
    /**
     * latitude of geographical position
     */
    latitude: number;
    /**
     * longitude of geographical position
     */
    longitude: number;
    /**
     * speed calculated between last position and current position
     */
    speed: number;
}