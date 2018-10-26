
import {Component} from "@angular/core";
import {NavController, ViewController, NavParams} from "ionic-angular";

import template from './editDriver.component.mobile.html'
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Driver} from "../../../../../both/models/driver.model";

@Component({
    selector: 'edit-driver',
    template
})

/**
 * component for edit driver action
 *
 * Created by dominiksecka on 2/21/17.
 */
export class EditDriverComponent{
    /**
     * stores instance of edit driver form
     */
    driverForm: FormGroup;
    /**
     * stores Driver object which should be edited
     */
    driver: Driver;

    /**
     * component of EditDriverComponent
     *
     * @param navCtrl - navigation controller for mobile app
     * @param formBuilder - builder for form and it's field with validation
     * @param viewController - controller for viewing content
     * @param navParams - navigation parameters
     */
    constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private viewController: ViewController, private navParams: NavParams) {
        this.driver = navParams.data;

        this.driverForm = this.formBuilder.group({
            name: [this.driver.name, Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            sex: [this.driver.sex],
            bus: [this.driver.bus],
            tram: [this.driver.tram],
            avg_speed: [0],
            max_speed: [0],
            rating: [0],
            no_rides: [0],
            online: ['false'],
            total_distance: [0],
            total_duration: [0],
            picture: ['images/user.svg']
        });
    }

    /**
     * function which provide edit action on driver object stored in drivers collection
     */
    editDriver() {
        if(this.driverForm.valid) {
            Drivers.insert(this.driverForm.value);
            this.viewController.dismiss();
        }
    }
}