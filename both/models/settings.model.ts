import { CollectionObject } from './collection-object.model';

/**
 * interface for Settings data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 4/21/17.
 */
export interface Settings extends CollectionObject{
    /**
     * date, when were settings created
     */
    date: Date;
    /**
     * version of settings
     */
    version: number;
    /**
     * accuracy of gps sensor
     */
    gps_accuracy: number;
    /**
     * time interval, in which new gps data are requested
     */
    location_update_time: number;
    /**
     * distance interval, in which new gps data are requested
     */
    location_update_dist: number;
    /**
     * if {true} filtering of low analyzed data is enabled, otherwise disabled
     */
    low_pass_filter: boolean;
    /**
     * value of low pass filtering coefficient
     */
    alpha_low_pass: number;
    /**
     * if {true} evaluation algorithm uses average values, otherwise algorithm uses peaks
     */
    use_average: boolean;
    /**
     * maximum value for sensitivity of acceleration event handling in bus
     */
    bus_max_acc: number;
    /**
     * minimum value for sensitivity of acceleration event handling in bus
     */
    bus_min_acc: number;
    /**
     * maximum value for sensitivity of breaking event handling in bus
     */
    bus_max_break: number;
    /**
     * minimum value for sensitivity of breaking event handling in bus
     */
    bus_min_break: number;
    /**
     * maximum value for sensitivity of turning event handling in bus
     */
    bus_max_turn: number;
    /**
     * minimum value for sensitivity of turning event handling in bus
     */
    bus_min_turn: number;
    /**
     * minimum value for sensitivity of gyroscope sensor in bus
     */
    bus_min_gyro_turn: number;
    /**
     * maximum value for sensitivity of acceleration event handling in tram
     */
    tram_max_acc: number;
    /**
     * minimum value for sensitivity of acceleration event handling in tram
     */
    tram_min_acc: number;
    /**
     * maximum value for sensitivity of breaking event handling in tram
     */
    tram_max_break: number;
    /**
     * minimum value for sensitivity of breaking event handling in tram
     */
    tram_min_break: number;
    /**
     * maximum value for sensitivity of turning event handling in tram
     */
    tram_max_turn: number;
    /**
     * minimum value for sensitivity of turning event handling in tram
     */
    tram_min_turn: number;
    /**
     * minimum value for sensitivity of gyroscope sensor in tram
     */
    tram_min_gyro_turn: number;
}