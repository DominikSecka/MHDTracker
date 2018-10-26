import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./settings.modal.component.web.html";
import style from "./settings.modal.component.web.scss";
import * as noUiSlider from "nouislider";
import {Subscription} from "rxjs/Subscription";
import {MeteorObservable} from "meteor-rxjs";
import {Observable} from "rxjs/Observable";
import {Settings} from "../../../../../both/models/settings.model";
import {SettingsCollection} from "../../../../../both/collections/settings.collection";
import {DatePipe} from "@angular/common";
import { Random } from 'meteor/random'
import * as _ from 'lodash';
import {AngularFire} from 'angularfire2';
import {Router} from "@angular/router";
import {ChangePasswordModalComponent} from "../changePasswordModal/changePassword.modal.component.web";
import {ToasterService} from 'angular2-toaster';
import {ChangeEmailModalComponent} from "../changeMailModal/changeMail.modal.component.web";
import {UnlockSettingsModalComponent} from "../unlockSettingsModal/unlockSettings.modal.component.web";
import {CropperModalComponent} from "../cropperModal/cropper.modal.component.web";
import {UUID} from "angular2-uuid";
import {upload} from "../../../../../both/methods/images.methods";
import {Dispatchers} from "../../../../../both/collections/dispatchers.collection";
import * as firebase from "firebase";
import {Dispatcher} from "../../../../../both/models/dispatcher.model";
import {DeleteDispatcherAccountModalComponent} from "../deleteDispatcherAccountModal/deleteDispatcherAccount.modal.component.web";

/**
 * context data model of SettingsModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * identifier of dispatcher
     * @type {string}
     */
    public id: string;
    /**
     * specifies if settings should be locked or unlocked
     * @type {boolean}
     */
    public unlocked: boolean;
}

@Component({
    selector: 'settings-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides fucntionality of changing system and dispatcher account settings
 * @implements {CloseGuard, ModalComponent<CustomModalContext>, AfterViewInit, OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class SettingsModalComponent implements CloseGuard, ModalComponent<CustomModalContext>, AfterViewInit, OnInit, OnDestroy {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * subscription to Meteor settings publication
     * @type {Subscription}
     */
    settingsSub: Subscription;
    /**
     * Observable cursor of settigns collection
     */
    settings: Observable<Settings[]>;
    /**
     * stores current settings saved in database
     * @type {Settings}
     */
    currentSettings: Settings;
    /**
     * stores old settings before edit
     * @type {Settings
     */
    oldSettings: Settings;
    /**
     * stores instance of slider for gps accuracy
     * @type {any}
     */
    accuracySlider: any;
    /**
     * stores instance of slider for gps update time
     * @type {any}
     */
    updateTimeSlider: any;
    /**
     * stores instance of slider for gps update distance
     * @type {any}
     */
    updateDistSlider: any;
    /**
     * stores instance of slider for bus acceleration monitoring sensitivity
     * @type {any}
     */
    busAcc: any;
    /**
     * stores instance of slider for bus breaking monitoring sensitivity
     * @type {any}
     */
    busBreak: any;
    /**
     * stores instance of slider for bus turning monitoring sensitivity
     * @type {any}
     */
    busTurn: any;
    /**
     * stores instance of slider for gyroscope sensitivity in bus
     * @type {any}
     */
    busGyro: any;
    /**
     * stores instance of slider for tram acceleration monitoring sensitivity
     * @type {any}
     */
    tramAcc: any;
    /**
     * stores instance of slider for tram breaking monitoring sensitivity
     * @type {any}
     */
    tramBreak: any;
    /**
     * stores instance of slider for tram turning monitoring sensitivity
     * @type {any}
     */
    tramTurn: any;
    /**
     * stores instance of slider for gyroscope sensitivity in tram
     * @type {any}
     */
    tramGyro: any;
    /**
     * stores instance of slider for low passing filter coefficient
     * @type {any}
     */
    lowPass: any;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores state of settings if are enabled to store or disabled
     * @type {boolean}
     */
    unlocked: boolean = false;
    /**
     * specific uuid for profile picture of driver
     * @type {string}
     */
    pictureUUID: string;
    /**
     * specific uuid for old profile picture of driver
     * @type {string}
     */
    oldPictureUUID: string;
    /**
     * if {true} file is over drag&drop section
     * @type {boolean}
     */
    fileIsOver: boolean = false;
    /**
     * if {true} uploading is in progress
     * @type {boolean}
     */
    uploading: boolean = false;
    /**
     * stores url of thumb
     * @type {string}
     */
    thumb_url: string;
    /**
     * stores dispatcher object with all it's fields
     * @type {Dispatcher}
     */
    dispatcher: Dispatcher;
    /**
     * stores state of using average values, enabled or disabled
     * @type {boolean}
     */
    useAverage: boolean = true;
    /**
     * stores stat of using low passing filter, enabled or disabled
     * @type {boolean}
     */
    lowPassFilter: boolean = true;

    /**
     * constructor of SettingsModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, public af: AngularFire, private router: Router) {
        this.toasterService = toasterService;
        // console.log(this.currentSettings);
        this.context = dialog.context;
        this.unlocked = this.context.unlocked;
        dialog.setCloseGuard(this);
    }

    /**
     * function that is called on component initialization, and initialized data about dispatcher
     */
    ngOnInit(): void {
        MeteorObservable.call("getDispatcherById", firebase.auth().currentUser.uid).subscribe((response) => {
            // Handle success and response from server!
            //console.log(response);
            if(response !== undefined) {
                this.thumb_url = response['dispatcher'].pictureUrl;
                this.oldPictureUUID = response['dispatcher'].picture;
                this.dispatcher = response['dispatcher'];
            }
        }, (err) => {
            // Handle error
            // console.log(err);
        });
    }

    /**
     * function that destroys subscriptions
     */
    ngOnDestroy(): void {
        if(this.settingsSub) {
            this.settingsSub.unsubscribe();
        }
    }

    /**
     * function that renders all sliders for settings
     */
    renderSliders() {
        this.accuracySlider = document.getElementById('gps-accuracy-slider');
        this.updateTimeSlider = document.getElementById('location-update-time');
        this.updateDistSlider = document.getElementById('location-update-dist');
        this.lowPass = document.getElementById('alpha-low-pass');
        this.busAcc = document.getElementById('bus_acc');
        this.busBreak = document.getElementById('bus_break');
        this.busTurn = document.getElementById('bus_turn');
        this.busGyro = document.getElementById('bus_gyro');
        this.tramAcc = document.getElementById('tram_acc');
        this.tramBreak = document.getElementById('tram_break');
        this.tramTurn = document.getElementById('tram_turn');
        this.tramGyro = document.getElementById('tram_gyro');

        noUiSlider.create(this.accuracySlider, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 0.2,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 50
            }
        });

        this.accuracySlider.noUiSlider.on('update', function (value) {
            document.getElementById('accuracy').innerHTML = value;
        });

        noUiSlider.create(this.updateTimeSlider, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 1000,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 20000
            }
        });

        this.updateTimeSlider.noUiSlider.on('update', function (value) {
            let datepipe = new DatePipe('eu');
            document.getElementById('location-time').innerHTML = datepipe.transform(value - 3600000, "ss");
        });

        noUiSlider.create(this.updateDistSlider, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 0.5,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 50
            }
        });

        this.updateDistSlider.noUiSlider.on('update', function (value) {
            document.getElementById('location-distance').innerHTML = value;
        });

        noUiSlider.create(this.lowPass, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 0.01,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 2
            }
        });

        this.lowPass.noUiSlider.on('update', function (value) {
            document.getElementById('low-pass').innerHTML = value;
        });

        noUiSlider.create(this.busAcc, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.busAcc.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('bus-acc-max').innerHTML = values[handle];
            } else {
                document.getElementById('bus-acc-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.busBreak, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.busBreak.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('bus-break-max').innerHTML = values[handle];
            } else {
                document.getElementById('bus-break-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.busTurn, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.busTurn.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('bus-turn-max').innerHTML = values[handle];
            } else {
                document.getElementById('bus-turn-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.busGyro, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 0.01,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 2
            }
        });

        this.busGyro.noUiSlider.on('update', function (value) {
            document.getElementById('bus-gyro').innerHTML = value;
        });

        noUiSlider.create(this.tramAcc, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.tramAcc.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('tram-acc-max').innerHTML = values[handle];
            } else {
                document.getElementById('tram-acc-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.tramBreak, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.tramBreak.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('tram-break-max').innerHTML = values[handle];
            } else {
                document.getElementById('tram-break-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.tramTurn, {
            animate: true,
            animationDuration: 300,
            start: [0, 0],
            step: 0.01,
            connect: true,
            range: {
                'min': 0,
                'max': 10
            }
        });

        this.tramTurn.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                document.getElementById('tram-turn-max').innerHTML = values[handle];
            } else {
                document.getElementById('tram-turn-min').innerHTML = values[handle];
            }
        });

        noUiSlider.create(this.tramGyro, {
            animate: true,
            animationDuration: 300,
            start: 0,
            step: 0.01,
            connect: [true, false],
            range: {
                'min': 0,
                'max': 2
            }
        });

        this.tramGyro.noUiSlider.on('update', function (value) {
            document.getElementById('tram-gyro').innerHTML = value;
        });
    }

    /**
     * function that is called after view init and initializes all sliders and subscriptions
     */
    ngAfterViewInit(): void {
        this.renderSliders();
        this.settingsSub = MeteorObservable.subscribe('settings').subscribe(() => {
            this.settings = SettingsCollection.find({}, {sort: {version: -1}}).first().zone();
            this.settings.subscribe(data => {
                // console.log(data[0]);
                this.currentSettings = data[0];
                this.oldSettings = data[0];
                this.resetSettings();
            })
        });
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
    }

    /**
     * function that handles navigation request to UnlockSettingsModalComponent
     */
    unlockSettings(){
        this.dialog.close();
        this.modal.open(UnlockSettingsModalComponent, overlayConfigFactory({ data: [] }, BSModalContext));
    }

    /**
     * function that handles navigation request to ChangePasswordModalComponent
     */
    changePassword(){
        this.dialog.close();
        this.modal.open(ChangePasswordModalComponent, overlayConfigFactory({ user: 'dispatcher' }, BSModalContext));
    }

    /**
     * function that handles navigation request to ChangeEmailModalComponent
     */
    changeEmail(){
        this.dialog.close();
        this.modal.open(ChangeEmailModalComponent, overlayConfigFactory({ user: 'dispatcher' }, BSModalContext));
    }

    /**
     * function that handles navigation request to DeleteDispatcherAccountModalComponent
     */
    deleteAccount(){
        this.dialog.close();
        this.modal.open(DeleteDispatcherAccountModalComponent, overlayConfigFactory({ user: 'dispatcher'}, BSModalContext));
    }

    /**
     * function that logout dispatcher
     */
    logout(){
        this.closeDialog();
        this.af.auth.logout();
        // console.log('logged out');
        this.router.navigateByUrl('/');
        this.toasterService.pop('success', 'Ďakujeme za návštevu!', 'Odhlásenie úspešné.');
    }

    /**
     * event handler for file over drag&drop section
     * @param fileIsOver - parameter that specifies if file is over drag&drop section
     */
    fileOver(fileIsOver: boolean): void {
        this.fileIsOver = fileIsOver;
    }

    /**
     * function that handles file drop
     * @param file - represents selected picture file
     */
    onFileDrop(file: File): void {
        this.uploading = true;

        upload(file)
            .then((result) => {
                this.uploading = false;

                // this.addFile(result);
                // this.thumb_url = result.url;
                this.openCropper(result.url);
                // console.log(result._id);
            })
            .catch((error) => {
                this.uploading = false;
                // console.log(`Something went wrong!`, error);
            });
    }

    /**
     * handler for navigation request to CropperModalComponent
     * @param url - url of selected file
     * @returns {Promise<DialogRef<any>>}
     */
    openCropper(url: string) {
        if(!this.pictureUUID) {
            this.pictureUUID = UUID.UUID();
        }
        let dialog = this.modal.open(CropperModalComponent, overlayConfigFactory({file_url: url, uuid: this.pictureUUID}, BSModalContext));

        dialog.then((resultPromise) => {
            resultPromise.result.then((result) => {
                // console.log(result);
                if(result === 'cancel'){
                    if(!this.thumb_url) {
                        this.thumb_url = 'images/dispatcher.svg';
                    }
                    this.pictureUUID = this.oldPictureUUID;
                }else if(result === 'success'){
                    this.uploading = true;
                    if(this.oldPictureUUID){
                        let storageRef = firebase.storage().ref().child('users/' + this.oldPictureUUID);
                        storageRef.delete();
                    }
                    let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
                    storageRef.getDownloadURL().then(url => {
                        this.uploading = false;
                        this.thumb_url = url;
                    });
                    setTimeout(() => {
                        Dispatchers.update(this.dispatcher._id, {$set: {picture: this.pictureUUID, pictureUrl: this.thumb_url}});
                    }, 800);
                }
            });
        });
    }

    /**
     * function that handles file change
     * @param event - event of file change
     */
    onFileChange(event) {
        var files = event.srcElement.files;
        this.onFileDrop(files[0]);
        // console.log(files[0]);
        event.srcElement.files = null;
    }

    /**
     * function that creates new settings and stores it to database
     */
    updateSettings() {
        let updatedSettings = Object.assign({}, this.currentSettings);
        updatedSettings.gps_accuracy = +document.getElementById('accuracy').innerText;
        updatedSettings.location_update_time = +document.getElementById('location-time').innerText * 1000;
        updatedSettings.location_update_dist = +document.getElementById('location-distance').innerText;
        updatedSettings.alpha_low_pass = +document.getElementById('low-pass').innerText;
        updatedSettings.low_pass_filter = this.lowPassFilter;
        updatedSettings.use_average = this.useAverage;
        updatedSettings.bus_min_acc = +document.getElementById('bus-acc-min').innerText;
        updatedSettings.bus_max_acc = +document.getElementById('bus-acc-max').innerText;
        updatedSettings.bus_min_break = +document.getElementById('bus-break-min').innerText;
        updatedSettings.bus_max_break = +document.getElementById('bus-break-max').innerText;
        updatedSettings.bus_min_turn = +document.getElementById('bus-turn-min').innerText;
        updatedSettings.bus_max_turn = +document.getElementById('bus-turn-max').innerText;
        updatedSettings.bus_min_gyro_turn = +document.getElementById('bus-gyro').innerText;
        updatedSettings.tram_min_acc = +document.getElementById('tram-acc-min').innerText;
        updatedSettings.tram_max_acc = +document.getElementById('tram-acc-max').innerText;
        updatedSettings.tram_min_break = +document.getElementById('tram-break-min').innerText;
        updatedSettings.tram_max_break = +document.getElementById('tram-break-max').innerText;
        updatedSettings.tram_min_turn = +document.getElementById('tram-turn-min').innerText;
        updatedSettings.tram_max_turn = +document.getElementById('tram-turn-max').innerText;
        updatedSettings.tram_min_gyro_turn = +document.getElementById('tram-gyro').innerText;

        if(!_.isEqual(updatedSettings,this.currentSettings)) {
            // console.log('saving new settings...');
            updatedSettings.version = this.currentSettings.version + 1;
            updatedSettings.date = new Date();
            updatedSettings._id = Random.id();
            SettingsCollection.insert(updatedSettings);
        }else{
            // console.log('settings not changed');
        }
    }

    /**
     * resents all sliders and options to latest stored in database
     */
    resetSettings() {
        if(this.currentSettings){
            this.accuracySlider.noUiSlider.set(this.currentSettings.gps_accuracy);
            this.updateTimeSlider.noUiSlider.set(this.currentSettings.location_update_time);
            this.updateDistSlider.noUiSlider.set(this.currentSettings.location_update_dist);
            this.lowPass.noUiSlider.set(this.currentSettings.alpha_low_pass);
            this.busAcc.noUiSlider.set([this.currentSettings.bus_min_acc, this.currentSettings.bus_max_acc]);
            this.busBreak.noUiSlider.set([this.currentSettings.bus_min_break, this.currentSettings.bus_max_break]);
            this.busTurn.noUiSlider.set([this.currentSettings.bus_min_turn, this.currentSettings.bus_max_turn]);
            this.busGyro.noUiSlider.set(this.currentSettings.bus_min_gyro_turn);
            this.tramAcc.noUiSlider.set([this.currentSettings.tram_min_acc, this.currentSettings.tram_max_acc]);
            this.tramBreak.noUiSlider.set([this.currentSettings.tram_min_break, this.currentSettings.tram_max_break]);
            this.tramTurn.noUiSlider.set([this.currentSettings.tram_min_turn, this.currentSettings.tram_max_turn]);
            this.tramGyro.noUiSlider.set(this.currentSettings.tram_min_gyro_turn);
            this.lowPassFilter = this.currentSettings.low_pass_filter;
            this.useAverage = this.currentSettings.use_average;
        }
    }

    /**
     * toogle function to enable or disable low passing values filter
     */
    lowPassToogle(){
        this.lowPassFilter = !this.lowPassFilter;
    }

    /**
     * toogle function to enable or disable using of average values
     */
    useAverageToogle(){
        this.useAverage = !this.useAverage;
    }

    /**
     * function that handles dismiss operation of modal dialog
     * @returns {boolean}
     */
    beforeDismiss(): boolean {
        return true;
    }

    /**
     * function that handles close operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}
