import {Pipe, PipeTransform} from '@angular/core';
import {Links} from "../../../../../both/collections/links.colleciton";
import {MeteorObservable} from "meteor-rxjs";

/**
 * pipe for transforming link direction to string
 * @implements {PipeTransform}
 * Created by dominiksecka on 3/29/17.
 */
@Pipe({name: 'directionToString'})
export class DirectionToString implements PipeTransform {
    /**
     * function that transforms direction from unicode to string
     *
     * @param direction - direction string in unicode
     * @return {string}
     */
    transform(direction: string): string {
        return this.unicodeToChar(direction);
    }

    /**
     * converter of unicode to string
     * @param text
     * @returns {string}
     */
    unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi,
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
    }
}
