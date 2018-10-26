import { DriversListComponent } from './drivers/drivers-list.component.web';
import {AppWebComponent} from "./app.component.web";
import {MainComponent} from "./main/main.component.web";
import {DispecingHeaderComponent} from "./header/header-dispecing.component.web";
import {TrafficListComponent} from "./traffic/traffic-list.component.web";
import {WarningsListComponent} from "./warnings/warnings-list.component.web";
import {Tabs} from "./tabs/tabs.component.web";
import {Tab} from "./tabs/tab";
import {MonitoringWebComponent} from "./monitoring/monitoring.component.web";
import {OnMapComponent} from "./on-map/on-map.component.web";
import {StatisticsWebComponent} from "./statistics/statistics.component.web";
import {AddDriverModalComponent} from "./addDriverModal/addDriver.modal.component.web";
import {EditDriverModalComponent} from "./editDriverModal/editDriver.modal.component.web";
import {DeleteDriverModalComponent} from "./deleteDriverModal/deleteDriver.modal.component.web";
import {SettingsModalComponent} from "./settingsModal/settings.modal.component.web";
import {WarningModalComponent} from "./sendWarningModal/sendWarning.modal.component.web";
import {CropperModalComponent} from "./cropperModal/cropper.modal.component.web";
import {ImageCropperComponent} from "ng2-img-cropper";
import {LoaderComponent} from "./tools/loader/loader.component";
import {RidesNotFoundComponent} from "./errorComponents/ridesNotFound/ridesNotFound.component";
import {AchievementsNotFoundComponent} from "./errorComponents/achievementsNotFound/achievementsNotFound.component";
import {ChartComponent} from "./tools/chartComponent/chart.component";
import {MapComponent} from "./tools/mapComponent/map.component";
import {StarComponent} from "./tools/ratingComponent/rating.component";
import {StarItemComponent} from "./tools/ratingComponent/ratingItem.component";
import {LoginChooseModalComponent} from "./loginChooseModal/loginChoose.modal.component.web";
import {RegisterModalComponent} from "./registerModal/register.modal.component.web";
import {ForgottenPasswordModalComponent} from "./forgottenPassword/forgottenPassword.modal.component.web";
import {IntroPageComponent} from "./introPage/introPage.component.web";
import {GeocodingService} from "./services/geocoding.service";
import {WarningsStatsComponent} from "./tools/warningsStatsComponent/warningsStats.component";
import {FloatingPointsComponent} from "./tools/floatingPoints/floatingPoints.component";
import {DriverLoginModalComponent} from "./driverLoginModal/driverLogin.modal.component.web";
import {DispatcherLoginModalComponent} from "./dispatcherLoginModal/dispatcherLogin.modal.component.web";
import {ChangePasswordModalComponent} from "./changePasswordModal/changePassword.modal.component.web";
import {AuthorizationComponent} from "./authorizationComponent/authorization.component.web";
import {ChangeEmailModalComponent} from "./changeMailModal/changeMail.modal.component.web";
import {UnlockSettingsModalComponent} from "./unlockSettingsModal/unlockSettings.modal.component.web";
import {DriverSettingsModalComponent} from "./driverSettingsModal/driverSettings.modal.component.web";
import {DeleteDispatcherAccountModalComponent} from "./deleteDispatcherAccountModal/deleteDispatcherAccount.modal.component.web";

/**
 * array of component declarations for web app
 * @type {Array}
 */
export const WEB_DECLARATIONS = [
    AppWebComponent,
    DriversListComponent,
    MainComponent,
    DispecingHeaderComponent,
    TrafficListComponent,
    WarningsListComponent,
    MonitoringWebComponent,
    OnMapComponent,
    StatisticsWebComponent,
    AddDriverModalComponent,
    EditDriverModalComponent,
    DeleteDriverModalComponent,
    SettingsModalComponent,
    WarningModalComponent,
    CropperModalComponent,
    ImageCropperComponent,
    LoaderComponent,
    ChartComponent,
    MapComponent,
    StarComponent,
    StarItemComponent,
    LoginChooseModalComponent,
    DriverLoginModalComponent,
    DispatcherLoginModalComponent,
    RegisterModalComponent,
    ForgottenPasswordModalComponent,
    IntroPageComponent,
    RidesNotFoundComponent,
    AchievementsNotFoundComponent,
    WarningsStatsComponent,
    FloatingPointsComponent,
    ChangePasswordModalComponent,
    AuthorizationComponent,
    ChangeEmailModalComponent,
    UnlockSettingsModalComponent,
    DriverSettingsModalComponent,
    DeleteDispatcherAccountModalComponent,
    Tabs,
    Tab
];