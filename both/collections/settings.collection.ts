/**
 * Created by dominiksecka on 4/21/17.
 */
import { MongoObservable } from 'meteor-rxjs';
import {Settings} from "../models/settings.model";

/**
 *
 * @type {MongoObservable.Collection<Settings>}
 * global constant that represents instance of MongoObservable cursor of analyzesettings collection
 */
export const SettingsCollection = new MongoObservable.Collection<Settings>('analyzesettings');