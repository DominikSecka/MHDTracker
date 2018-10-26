/**
 * Created by dominiksecka on 3/28/17.
 */
import { MongoObservable } from 'meteor-rxjs';

import {Ride} from "../models/ride.model";

/**
 *
 * @type {MongoObservable.Collection<Ride>}
 * global constant that represents instance of MongoObservable cursor of rides collection
 */
export const Rides = new MongoObservable.Collection<Ride>('rides');