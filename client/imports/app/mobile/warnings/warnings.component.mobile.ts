import { Component } from '@angular/core';

import template from './warnings.component.mobile.html'
import {Driver} from "../../../../../both/models/driver.model";
import {Observable} from "rxjs";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {NavController} from "ionic-angular";
import {MonitoringComponent} from "../monitoring/monitoring.component.mobile";
import {OnMapComponent} from "../onMap/onMap.component.mobile";

@Component({
    selector: 'tab-warnings',
    template
})

/**
 * component that displays actual warnings in system
 *
 * Created by dominiksecka on 2/16/17.
 */
export class WarningsComponent{

    /**
     * constructor of WarningComponent
     * @param navCtrl - navigation controller for mobile app
     */
    constructor(public navCtrl: NavController) {

    }

    /**
     * function that handles navigation request to MonitoringComponent
     */
    monitoringClicked(){
        this.navCtrl.push(MonitoringComponent);
    }

    /**
     * function that handles navigation request to OnMapComponent
     */
    onMapClicked(){
        this.navCtrl.push(OnMapComponent);
    }

    /**
     * function that sends warning message to driver's native application
     */
    sendWarning(){
        //TODO: implement this method
    }

    /**
     * function, which refreshes the list view of online rides
     *
     * @param refresher - instance of refresher
     */
    doRefresh(refresher) {
        //console.log('Begin async operation', refresher);

        setTimeout(() => {
            //console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
