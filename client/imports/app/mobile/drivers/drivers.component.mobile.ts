import { Component } from '@angular/core';

import template from './drivers.component.mobile.html'
import {Observable} from "rxjs";
import {Driver} from "../../../../../both/models/driver.model";
import {Drivers} from "../../../../../both/collections/drivers.collection";

import style from './drivers.component.mobile.scss'
import {NavController} from "ionic-angular";
import {AddDriverComponent} from "../addDriver/addDriver.component.mobile";
import {EditDriverComponent} from "../editDriver/editDriver.component.mobile";
import {DriverStatisticsComponent} from "../driverStatistics/driverStatistics.component.mobile";
import {MeteorObservable} from "meteor-rxjs";
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'tab-drivers',
    template,
    styleUrls: [style],
})

/**
 * Main component for viewing information about registered drivers in
 *
 * Created by dominiksecka on 2/16/17.
 */
export class DriversComponent{
    /**
     * stores Observable cursor of filtered drivers collection
     */
    drivers: Observable<Driver[]>;
    /**
     * represents instance of subscription for drivers Meteor publication
     */
    driversSub: Subscription;

    /**
     * constructor for DriversComponent
     *
     * @param navCtrl - navigation controller in mobile app
     */
    constructor(public navCtrl: NavController) {
        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
            this.drivers = Drivers.find({}, {
                sort: {
                    name: 1
                }
            }).zone();
        });
    }

    /**
     * function for handling input from search
     *
     * @param event - event of changing input for driver name in search
     */
    onInput(event): void{
        this.drivers = Drivers.find(event.target.value ? { name: {$regex : event.target.value}} : {}).zone();
    }

    /**
     * function for handle navigation change request to AddDriver component view
     */
    addDriverClicked(){
        this.navCtrl.push(AddDriverComponent);
    }

    /**
     * function for handle navigation change request to EditDriver component view
     *
     * @param driver - Driver object, which stores information about driver, who should be edited
     */
    editDriverClicked(driver: Driver){
        this.navCtrl.push(EditDriverComponent, driver);
    }

    /**
     * function for delete driver from system
     *
     * @param driver - Driver object, which stores information about driver, who should be deleted
     */
    removeDriverClicked(driver: Driver){
        Drivers.remove(driver._id);
    }

    /**
     * function for handle navigation change request to DriverStatisticsComponent view
     */
    statisticsClicked(){
        this.navCtrl.push(DriverStatisticsComponent);
    }

    /**
     * function, which refreshes the list view of driver
     *
     * @param refresher - instance of refresher
     */
    doRefresh(refresher) {
        // console.log('Begin async operation', refresher);

        setTimeout(() => {
            // console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
