/**
 * Created by dominiksecka on 2/15/17.
 */
import 'angular2-meteor-polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { AppModule } from './imports/app/app.module';
import ionicSelector from 'ionic-selector';

function setClass(css) {
    if (!document.body.className) {
        document.body.className = "";
    }
    document.body.className += " " + css;
}

enableProdMode();

/**
 * meteor server startup
 */
Meteor.startup(() => {
    if(Meteor.isCordova){
        ionicSelector("app");
        setClass('mobile');
    }
    else {
        setClass('web');
    }

    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
});