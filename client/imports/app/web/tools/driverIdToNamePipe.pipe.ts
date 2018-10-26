import {Pipe, PipeTransform} from '@angular/core';
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {MeteorObservable} from "meteor-rxjs";

/**
 * pipe that tranforms driver's id to driver's name
 * @implements {PipeTransform}
 * Created by dominiksecka on 3/29/17.
 */
@Pipe({name: 'idToName'})
export class IdToName implements PipeTransform {
    /**
     * function that transforms driver's identifier to driver's name
     *
     * @param driverId - identifier of driver
     * @return {string}
     */
    transform(driverId: string): string {
        return Drivers.findOne({_id: driverId}).name;
    }
}
