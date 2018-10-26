/**
 * Created by dominiksecka on 3/28/17.
 */
import { MongoObservable } from 'meteor-rxjs';

import {Link} from "../models/link.model";

/**
 *
 * @type {MongoObservable.Collection<Link>}
 * global constant that represents instance of MongoObservable cursor of links collection
 */
export const Links = new MongoObservable.Collection<Link>('links');