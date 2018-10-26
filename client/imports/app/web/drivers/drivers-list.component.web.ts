import {Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/combineLatest';


import {Drivers} from '../../../../../both/collections/drivers.collection';
import { Driver } from '../../../../../both/models/driver.model';

import template from './drivers-list.component.web.html';
import style from './drivers-list.component.web.scss';
import {EditDriverModalComponent} from "../editDriverModal/editDriver.modal.component.web";
import {AddDriverModalComponent} from "../addDriverModal/addDriver.modal.component.web";
import {DeleteDriverModalComponent} from "../deleteDriverModal/deleteDriver.modal.component.web";
import {MeteorObservable} from "meteor-rxjs";
import { PaginationService } from 'ng2-pagination';
import {Route} from "@angular/router";

@Component({
    selector: 'drivers-list',
    template,
    styleUrls: [style]
})

/**
 * component that provides list of registered drivers
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 2/15/17.
 */
export class DriversListComponent implements OnInit, OnDestroy{
    /**
     * Observable cursor of drivers collection
     * @type {Observable<Driver[]>}
     */
    drivers: Observable<Driver[]>;
    /**
     * drivers subscription to Meteor drivers publication
     * @type {Subscription}
     */
    driversSub: Subscription;
    /**
     * stores current page information
     * @type {Subject<number>}
     */
    curPage: Subject<number> = new Subject<number>();
    /**
     * count of items in full list of drivers
     * @type {number}
     */
    driversSize: number = 0;

    /**
     * constructor of DriversListComponent
     *
     * @param modal - modal dialog handler
     * @param paginationService - service for pagination of the list
     */
    constructor(public modal: Modal, public paginationService: PaginationService) {

    }

    /**
     * function that initializes all subscriptions on component initialization
     */
    ngOnInit() {
        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
            this.drivers = Drivers.find({}, {
                sort: {
                    name: 1
                }
            }).zone();
            this.drivers.subscribe(data => this.driversSize = data.length);
        });
    }

    /**
     * function that provides seach functionality
     * @param value - value hadled from search input
     */
    searchValuechange(value) {
        // console.log(value);
        this.driversSub = MeteorObservable.subscribe('drivers').subscribe(() => {
            this.drivers = Drivers.find(value ? { name: {$regex : value, $options : 'i'}} : {}, {
                sort: {
                    name: 1
                },
            }).zone();
            this.drivers.subscribe(data => this.driversSize = data.length);
        });
    }

    /**
     * function that destroy all subscriptions
     */
    ngOnDestroy(): void {
        if(this.driversSub) {
            this.driversSub.unsubscribe();
        }
    }

    /**
     * function that handles change of page
     * @param page - order number of pages
     */
    onPageChanged(page: number): void {
        this.curPage.next(page);
    }

    /**
     * function that handles navigation request to AddDriverModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    createNewDriver() {
        return this.modal.open(AddDriverModalComponent, overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));
    }

    /**
     * function that handles navigation request to EditDriverModalComponent
     * @param driver - Driver object with information about selected driver
     * @returns {Promise<DialogRef<any>>}
     */
    editDriverProfile(driver: Driver){
        return this.modal.open(EditDriverModalComponent, overlayConfigFactory({ driver: driver }, BSModalContext));
    }

    /**
     * function that handles navigation request to DeleteDriverModalComponent
     * @param driver - Driver object with information about selected driver
     * @returns {Promise<DialogRef<any>>}
     */
    deleteDriver(driver: Driver){
        return this.modal.open(DeleteDriverModalComponent, overlayConfigFactory({ id: driver._id, name: driver.name, picture: driver.picture, pictureUrl: driver.pictureUrl }, BSModalContext));
    }
}

/**
 * path to this component
 * @type {[{path: string; component: DriversListComponent}]}
 */
export const DriversListRoutes: Route[] = [{ path: 'drivers', component: DriversListComponent }];