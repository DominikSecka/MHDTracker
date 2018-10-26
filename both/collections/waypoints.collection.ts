/**
 * Created by dominiksecka on 3/28/17.
 */
import { MongoObservable } from 'meteor-rxjs';
import {Waypoint} from "../models/waypoint.model";

/**
 *
 * @type {MongoObservable.Collection<Waypoint>}
 * global constant that represents instance of MongoObservable cursor of waypoins collection
 */
export const Waypoints = new MongoObservable.Collection<Waypoint>('waypoints');