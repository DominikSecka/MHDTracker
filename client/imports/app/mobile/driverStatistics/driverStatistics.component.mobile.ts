
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import template from './driverStatistics.component.mobile.html'

@Component({
    selector: 'statistics-driver',
    template
})

/**
 * component for display driver statistics
 *
 * Created by dominiksecka on 2/21/17.
 */
export class DriverStatisticsComponent{

    /**
     * constructor of DriverStatisticsComponent
     *
     * @param navCtrl - navigation controller in mobile app UI
     */
    constructor(public navCtrl: NavController) {

    }
}