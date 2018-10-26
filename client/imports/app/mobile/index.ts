import { TabsComponent } from './tabs/tabs.component.mobile';
import { AppMobileComponent } from "./app.component.mobile";
import { TrafficComponent } from "./traffic/traffic.component.mobile";
import { WarningsComponent } from "./warnings/warnings.component.mobile";
import {DriversComponent} from "./drivers/drivers.component.mobile";
import {ProfileComponent} from "./profile/profile.component.mobile";
import {OptionsComponent} from "./options/options.component.mobile";
import {AddDriverComponent} from "./addDriver/addDriver.component.mobile";
import {EditDriverComponent} from "./editDriver/editDriver.component.mobile";
import {DriverStatisticsComponent} from "./driverStatistics/driverStatistics.component.mobile";
import {MonitoringComponent} from "./monitoring/monitoring.component.mobile";
import {OnMapComponent} from "./onMap/onMap.component.mobile";

/**
 * constant that stores all declarations of components for mobile app
 * @type {Array}
 */
export const MOBILE_DECLARATIONS = [
    AppMobileComponent,
    TrafficComponent,
    WarningsComponent,
    DriversComponent,
    ProfileComponent,
    OptionsComponent,
    TabsComponent,
    AddDriverComponent,
    EditDriverComponent,
    DriverStatisticsComponent,
    MonitoringComponent,
    OnMapComponent
 ];