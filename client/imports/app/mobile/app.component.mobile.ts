
import {Component} from "@angular/core";
import template from "./app.component.mobile.html";
import {MenuController, Platform, App} from "ionic-angular";
import {TabsComponent} from "./tabs/tabs.component.mobile";
import {Router} from "@angular/router";
import { StatusBar, Splashscreen } from 'ionic-native';
import {TrafficComponent} from "./traffic/traffic.component.mobile";

if (Meteor.isCordova) {
    require("ionic-angular/css/ionic.css");
}

@Component({
    selector: "app",
    template
})

/**
 * main mobile app component
 *
 * Created by dominiksecka on 2/16/17.
 */
export class AppMobileComponent {

    rootPage = TabsComponent;

    /**
     * constructor of main mobile component AppMobileComponent
     *
     * @param app - main instance of app
     * @param platform - specifies platform on which application should be deployed
     * @param menu - menu controller
     */
    constructor(app: App, platform: Platform, menu: MenuController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is('cordova')) {
                // StatusBar.styleDefault();
                StatusBar.overlaysWebView(true);
                Splashscreen.hide();
            }
        });
    }
}