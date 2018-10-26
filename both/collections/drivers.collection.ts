/**
 * Created by dominiksecka on 2/15/17.
 */
import { MongoObservable } from 'meteor-rxjs';

import { Driver } from '../models/driver.model';

/**
 *
 * @type {MongoObservable.Collection<Driver>}
 * global constant that represents instance of MongoObservable cursor of drivers collection
 */
export const Drivers = new MongoObservable.Collection<Driver>('drivers');