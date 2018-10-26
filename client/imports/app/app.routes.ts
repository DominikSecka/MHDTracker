import { Route } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import {TrafficComponent} from "./mobile/traffic/traffic.component.mobile";
import {MainComponent} from "./web/main/main.component.web";
import {StatisticsWebComponent} from "./web/statistics/statistics.component.web";
import {MonitoringWebComponent} from "./web/monitoring/monitoring.component.web";
import {OnMapComponent} from "./web/on-map/on-map.component.web";
import {TrafficListRoutes} from "./web/traffic/traffic-list.component.web";
import {WarningsListRoutes} from "./web/warnings/warnings-list.component.web";
import {DriversListRoutes} from "./web/drivers/drivers-list.component.web";
import {IntroPageComponent} from "./web/introPage/introPage.component.web";
import {AuthGuardService} from "./web/services/auth.guard.service";
import {DispatcherAuthGuardService} from "./web/services/dispatcher.auth.guard.service";
import {DriverAuthGuardService} from "./web/services/driver.auth.guard.service";
import {AuthorizationComponent} from "./web/authorizationComponent/authorization.component.web";
import {RideAuthGuardService} from "./web/services/ride.auth.guard.service";

/**
 * array of paths specified for web application
 * @type {Array}
 * Created by dominiksecka on 2/16/17.
 */
export const routes: Route[] = [
    // ...TrafficListRoutes,
    // ...WarningsListRoutes,
    // ...DriversListRoutes,
    // { path: '', component: Meteor.isCordova ? TrafficComponent : MainComponent },
    { path: '', redirectTo: 'intro', pathMatch: 'full'},
    { path: 'intro', component: Meteor.isCordova ? TrafficComponent : IntroPageComponent},
    { path: 'dispatching', component: MainComponent, canActivate: [DispatcherAuthGuardService]},
    { path: 'statistics/:id/:driver', component: StatisticsWebComponent, canActivate: [DriverAuthGuardService]},
    { path: 'monitoring/:id', component: MonitoringWebComponent, canActivate: [RideAuthGuardService]},
    { path: 'on-map/:id', component: OnMapComponent, canActivate: [RideAuthGuardService]},
    { path: 'authorization', component: AuthorizationComponent, canActivate: [AuthGuardService]}
];
