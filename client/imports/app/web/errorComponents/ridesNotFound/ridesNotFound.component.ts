
import {Component} from "@angular/core";

import template from './ridesNotFound.component.html'
import style from './ridesNotFound.component.scss'

@Component({
    selector: 'rides-not-found',
    template,
    styleUrls: [style]
})

/**
 * component, which provides information that rides were not found
 * Created by dominiksecka on 3/30/17.
 */
export class RidesNotFoundComponent {
    /**
     * constructor of RidesNotFoundComponent
     */
    constructor() {
    }
}
