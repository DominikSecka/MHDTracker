import {CollectionObject} from "./collection-object.model";
import {WaypointWarning} from "./waypointWarning.model";

/**
 * interface for RideWarning data model
 * @extends {CollectionObject}
 * Created by dominiksecka on 4/21/17.
 */
export interface RideWarning extends CollectionObject {
    /**
     * enumeration value of type of warning
     */
    key: string;
    /**
     * identifier of ride, where warning was reached
     */
    ride_id: string;
    /**
     * waypoint object with data, which represent reason for warning
     */
    waypoint: WaypointWarning;
    /**
     * if {true} one of the dispatcher reviewed warning, otherwise warning is still showing in application
     */
    reviewed: boolean;
}