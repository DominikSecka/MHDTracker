import {Component, } from '@angular/core';

import template from './tabs.component.mobile.html'
import {TrafficComponent} from "../traffic/traffic.component.mobile";
import {WarningsComponent} from "../warnings/warnings.component.mobile";
import {DriversComponent} from "../drivers/drivers.component.mobile";
import {ProfileComponent} from "../profile/profile.component.mobile";
import {OptionsComponent} from "../options/options.component.mobile";

@Component({
    selector: 'tabs',
    template
})

/**
 * main tabs displaying component - summarizes all main parts of application
 *
 * Created by dominiksecka on 2/16/17.
 */
export class TabsComponent{
    /**
     * first tab in main screen of mobile app
     * @type {TrafficComponent}
     */
    tab1Root = TrafficComponent;
    /**
     * second tab in main screen of mobile app
     * @type {WarningsComponent}
     */
    tab2Root = WarningsComponent;
    /**
     * third tab in main screen of mobile app
     * @type {DriversComponent}
     */
    tab3Root = DriversComponent;
    /**
     * fourth tab in main screen of mobile app
     * @type {ProfileComponent}
     */
    tab4Root = ProfileComponent;
    /**
     * fifth tab in main screen of mobile app
     * @type {OptionsComponent}
     */
    tab5Root = OptionsComponent;
    /**
     * if {true} tabs are visible, otherwise tabs are hidden
     * @type {boolean}
     */
    tabsshow = true;

    /**
     * constructor of TabsComponent
     */
    constructor() {

    }
}
