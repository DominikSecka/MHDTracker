
import template from './loader.component.html';
import {Component, Input} from "@angular/core";

@Component({
    selector: 'loader',
    template: template
})

/**
 * component of data loader
 * Created by dominiksecka on 3/29/17.
 */
export class LoaderComponent {
    /**
     * element attribute for top margination
     * @type {string}
     */
    @Input() marginTop;

    /**
     * constructor of LoaderComponent
     */
    constructor() {
        
    }
}