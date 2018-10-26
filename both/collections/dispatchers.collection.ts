/**
 * Created by dominiksecka on 4/21/17.
 */

import { MongoObservable } from 'meteor-rxjs';
import {Dispatcher} from "../models/dispatcher.model";

/**
 *
 * @type {MongoObservable.Collection<Dispatcher>}
 * global constant that represents instance of MongoObservable cursor instance of dispatcher collection
 */
export const Dispatchers = new MongoObservable.Collection<Dispatcher>('dispatchers');