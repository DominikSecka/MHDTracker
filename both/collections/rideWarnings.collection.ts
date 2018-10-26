/**
 * Created by dominiksecka on 4/21/17.
 */
import { MongoObservable } from 'meteor-rxjs';
import {RideWarning} from "../models/rideWarnings.model";

/**
 *
 * @type {MongoObservable.Collection<RideWarning>}
 * global constant that represents instance MongoObservable cursor of ridewarnings collection
 */
export const RideWarnings = new MongoObservable.Collection<RideWarning>('ridewarnings');