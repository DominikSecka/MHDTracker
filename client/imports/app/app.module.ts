import 'zone.js';
import 'reflect-metadata';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import {IonicModule, IonicApp} from "ionic-angular";
import {AppMobileComponent} from "./mobile/app.component.mobile";
import {MOBILE_DECLARATIONS} from "./mobile/index";
import {WEB_DECLARATIONS} from "./web/index";
import {AppWebComponent} from "./web/app.component.web";
import { AgmCoreModule } from 'angular2-google-maps/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import {AddDriverModalComponent, CheckboxValidator} from "./web/addDriverModal/addDriver.modal.component.web";
import {EditDriverModalComponent} from "./web/editDriverModal/editDriver.modal.component.web";
import {DeleteDriverModalComponent} from "./web/deleteDriverModal/deleteDriver.modal.component.web";
import {SettingsModalComponent} from "./web/settingsModal/settings.modal.component.web";
import {WarningModalComponent} from "./web/sendWarningModal/sendWarning.modal.component.web";
import {
    AngularFireModule,
    AuthMethods,
    AuthProviders
} from "angularfire2";
import { FileDropModule } from "angular2-file-drop";
import {CropperModalComponent} from "./web/cropperModal/cropper.modal.component.web";
import { MyDatePickerModule } from 'mydatepicker';
import {MomentModule} from "angular2-moment";
import { Ng2PaginationModule } from 'ng2-pagination';
import { DatePipe } from '@angular/common';
import {IdToName} from "./web/tools/driverIdToNamePipe.pipe";
import {DirectionToString} from "./web/tools/booleanDirectionToString.pipe";
import { HttpModule, JsonpModule }    from '@angular/http';
import {NguiMapModule} from "@ngui/map";
import {GeocodingService} from "./web/services/geocoding.service";
import * as firebase from 'firebase';
import { NouisliderModule } from 'ng2-nouislider';
import {LoginChooseModalComponent} from "./web/loginChooseModal/loginChoose.modal.component.web";
import {DispatcherLoginModalComponent} from "./web/dispatcherLoginModal/dispatcherLogin.modal.component.web";
import {DriverLoginModalComponent} from "./web/driverLoginModal/driverLogin.modal.component.web";
import {ForgottenPasswordModalComponent} from "./web/forgottenPassword/forgottenPassword.modal.component.web";
import {RegisterModalComponent} from "./web/registerModal/register.modal.component.web";
import {AuthGuardService} from "./web/services/auth.guard.service";
import {ChangePasswordModalComponent} from "./web/changePasswordModal/changePassword.modal.component.web";
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {DispatcherAuthGuardService} from "./web/services/dispatcher.auth.guard.service";
import {DriverAuthGuardService} from "./web/services/driver.auth.guard.service";
import {RideAuthGuardService} from "./web/services/ride.auth.guard.service";
import {EqualValidator} from "./web/directives/equalValidator.directive";
import { EqualTextValidator } from "angular2-text-equality-validator";
import {ChangeEmailModalComponent} from "./web/changeMailModal/changeMail.modal.component.web";
import {UnlockSettingsModalComponent} from "./web/unlockSettingsModal/unlockSettings.modal.component.web";
import {DriverSettingsModalComponent} from "./web/driverSettingsModal/driverSettings.modal.component.web";
import {SelectModule} from "angular2-select";
import {DeleteDispatcherAccountModalComponent} from "./web/deleteDispatcherAccountModal/deleteDispatcherAccount.modal.component.web";

/**
 * firebase configurations
 * @type {{apiKey: string; authDomain: string; databaseURL: string; projectId: string; storageBucket: string; messagingSenderId: string}}
 */
const firebaseConfig = {
    apiKey: "AIzaSyCCan0DLzqUHM1IJ2FikRqRUghd9Z73Hkw",
    authDomain: "mhdtracker-c3fd3.firebaseapp.com",
    databaseURL: "https://mhdtracker-c3fd3.firebaseio.com",
    projectId: "mhdtracker-c3fd3",
    storageBucket: "mhdtracker-c3fd3.appspot.com",
    messagingSenderId: "28591032319"
};

/**
 * initialization of firebase app
 */
firebase.initializeApp(firebaseConfig);

/**
 * module definition
 */
let moduleDefinition;
/**
 * check for platform
 */
if (Meteor.isCordova){
    moduleDefinition = {
        declarations: [
            ...MOBILE_DECLARATIONS,
        ],
        imports: [
            IonicModule.forRoot(AppMobileComponent,
            {
                tabsPlacement: 'bottom'
                // platforms: {
                //     android: {
                //         mode: 'ios'
                //     },
                // }
            }
            ),
            AgmCoreModule.forRoot({
                apiKey: 'AIzaSyCL7hKSeW4_dtNMGIKvCEUYCTjJLieTnPs'
            }),
            FormsModule,
            ReactiveFormsModule
        ],
        providers: [
            DatePipe
        ],
        bootstrap: [
            IonicApp
        ],
        entryComponents: [
            ...MOBILE_DECLARATIONS
        ]
    }
}
else {
    moduleDefinition = {
        imports: [
            BrowserModule,
            AngularFireModule.initializeApp(firebaseConfig,{
                provider: AuthProviders.Google,
                method: AuthMethods.Popup
            }),
            ModalModule.forRoot(),
            BootstrapModalModule,
            FormsModule,
            FileDropModule,
            ReactiveFormsModule,
            HttpModule,
            JsonpModule,
            ToasterModule,
            SelectModule,
            NouisliderModule,
            RouterModule.forRoot(routes),
            AgmCoreModule.forRoot({
                apiKey: 'AIzaSyDyK1mCZtPw8qhaCB9z6d0Q81KdASa54fI'
            }),
            MyDatePickerModule,
            MomentModule,
            //NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD6UHO3ybE6cxIAyFqy8W8Q8MQZKJNgosw'}),
            Ng2PaginationModule
        ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
        providers: [
            GeocodingService,
            DatePipe,
            AuthGuardService,
            DispatcherAuthGuardService,
            DriverAuthGuardService,
            RideAuthGuardService,
            CheckboxValidator
        ],
        declarations: [
            ...WEB_DECLARATIONS,
            IdToName,
            DirectionToString,
            EqualValidator,
            EqualTextValidator
        ],
        bootstrap: [
            AppWebComponent
        ],
        entryComponents: [
            AddDriverModalComponent,
            EditDriverModalComponent,
            DeleteDriverModalComponent,
            SettingsModalComponent,
            WarningModalComponent,
            CropperModalComponent,
            LoginChooseModalComponent,
            DriverLoginModalComponent,
            DispatcherLoginModalComponent,
            ForgottenPasswordModalComponent,
            RegisterModalComponent,
            ChangePasswordModalComponent,
            ChangeEmailModalComponent,
            UnlockSettingsModalComponent,
            DriverSettingsModalComponent,
            DeleteDispatcherAccountModalComponent
        ]
    }

}

/**
 * ngModule definition
 */
@NgModule(moduleDefinition)

/**
 * main application module
 * Created by dominiksecka on 2/15/17.
 */
export class AppModule {}