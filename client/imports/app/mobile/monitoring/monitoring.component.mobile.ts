import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import template from './monitoring.component.mobile.html'

@Component({
    selector: 'monitoring',
    template
})

/**
 * component for display monitoring in mobile app
 *
 * Created by dominiksecka on 2/21/17.
 */
export class MonitoringComponent{

    /**
     * constructor for MonitoringComponent
     *
     * @param navCtrl - navigation controller of mobile app
     */
    constructor(public navCtrl: NavController) {

    }
}