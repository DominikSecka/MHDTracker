import { Component } from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Drivers } from '../../../../../both/collections/drivers.collection';

import template from './addDriver.component.mobile.html';
import style from './addDriver.component.mobile.css';

@Component({
    selector: 'add-driver',
    template,
    styleUrls: [style],
})

/**
 * AddDriverComponent - serves as child screen for new driver adding in mobile UI
 *
 * Created by dominiksecka on 2/21/17.
 */
export class AddDriverComponent {
    /**
     * stores instance of form in this component
     */
    driverForm: FormGroup;

    /**
     * constructor of AddDriverComponent
     *
     * @param navCtrl - navigation controller in mobile app
     * @param formBuilder - builder for form fields and validation
     * @param viewController - controller of viewing content
     */
    constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private viewController: ViewController) {
        // this.initNewDriver();
        this.driverForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            surname: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            sex: [],
            bus: [],
            tram: [],
            avg_speed: [0],
            max_speed: [0],
            rating: [100],
            no_rides: [0],
            online: ['false'],
            total_distance: [0],
            total_duration: [0],
            picture: ['images/user.svg']
        });
    }

    /**
     * function for registering of new driver to system
     */
    addDriver() {
        if(this.driverForm.valid) {
            Drivers.insert(this.driverForm.value);
            this.viewController.dismiss();
        }
    }
}