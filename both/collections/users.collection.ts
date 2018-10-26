/**
 * Created by dominiksecka on 3/16/17.
 */
import { MongoObservable } from 'meteor-rxjs';

import {User} from "../models/user.model";

/**
 *
 * @type {MongoObservable.Collection<User>}
 * global constant that represents instance of MongoObservable cursor of users collection - part of old solution
 */
export const Users = new MongoObservable.Collection<User>('users');