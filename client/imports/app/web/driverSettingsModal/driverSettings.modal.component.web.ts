import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./driverSettings.modal.component.web.html";
import style from "./driverSettings.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import * as firebase from "firebase";
import {ToasterService} from 'angular2-toaster';
import {Router} from "@angular/router";
import {ChangePasswordModalComponent} from "../changePasswordModal/changePassword.modal.component.web";
import {ChangeEmailModalComponent} from "../changeMailModal/changeMail.modal.component.web";
import {IMyDateModel, IMyOptions} from "mydatepicker";
import {Driver} from "../../../../../both/models/driver.model";
import {NAME_REGEXP} from "../registerModal/register.modal.component.web";
import {CheckboxValidator} from "../addDriverModal/addDriver.modal.component.web";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {CropperModalComponent} from "../cropperModal/cropper.modal.component.web";
import {UUID} from "angular2-uuid";
import {upload} from "../../../../../both/methods/images.methods";

/**
 * modal context for DriverSettingsModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 5/6/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * driver object with information about driver
     */
    public driver: Driver;
}

@Component({
    selector: 'driver-settings-modal',
    template,
    styleUrls: [style]
})

/**
 * compenent that represents settings for driver account
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 5/6/17.
 */
export class DriverSettingsModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    private driverEditForm: FormGroup;
    /**
     * stores error messages stacktrace
     * @type {any}
     */
    error: any;
    /**
     * if {true} password is in visible form, otherwise hidden
     * @type {boolean}
     */
    showPassword: boolean = false;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores email from form
     * @type {string}
     */
    newEmail: string;
    /**
     * stores password from form
     * @type {string}
     */
    password: string;
    /**
     * stores birthday from date picker
     * @type {Date}
     */
    birthday: Date;
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
     * stores url of thumb
     * @type {string}
     */
    thumb_url: string;
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
     * myDatePicker option
     * @type {{dateFormat: string; showTodayBtn: boolean; maxYear: number; width: string; height: string; selectionTxtFontSize: string}}
     */
    private myDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
        showTodayBtn: false,
        maxYear: 2017,
        width: '84%',
        height: '28px',
        selectionTxtFontSize: '14px'
    };

    /**
     * placeholder for myDatePicker
     * @type {string}
     */
    private placeholder: string = 'dátum narodenia';

    /**
     * stores model of date
     * @type {Object}
     */
    private model: Object;

    /**
     * constructor of DriverSettingsModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService,public router: Router, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire) {
        this.context = dialog.context;
        this.birthday = new Date(this.context.driver.birthday);
        this.oldPictureUUID = this.context.driver.picture;
        this.thumb_url = this.context.driver.pictureUrl;
        this.model = {
            date: {
                year: this.birthday.getFullYear(),
                month: this.birthday.getMonth() + 1,
                day: this.birthday.getDate()
            }
        };
        this.toasterService = toasterService;
        this.driverEditForm = fb.group({
            name: [this.context.driver.name, [Validators.required, Validators.pattern(NAME_REGEXP)]],
            sex: [this.context.driver.sex, [Validators.required]],
            birthday: [this.context.driver.birthday ? this.context.driver.birthday : '', [Validators.required]],
            driverPassword: ['', [Validators.required]]
        });
        this.driverEditForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any) {
        if (!this.driverEditForm) {
            return;
        }
        const form = this.driverEditForm;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    /**
     * function that handled date change in date picker
     * @param event - event of changing date
     */
    onDateChanged(event: IMyDateModel) {
        this.driverEditForm.value.birthday = event.jsdate;
        //console.log(event.jsdate);
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

    /**
     * form error divs
     * @type {{name: string; sex: string; birthday: string; driverPassword: string}}
     */
    formErrors = {
        'name': '',
        'sex': '',
        'birthday': '',
        'driverPassword': ''
    };

    /**
     * form error messages
     * @type {{name: {required: string; pattern: string}; birthday: {required: string}; driverPassword: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'name': {
            'required': 'Zadajte meno nového dispečera!',
            'pattern': 'Uvedené meno nemá formu - meno a priezvisko!'
        },
        'birthday': {
            'required': 'Zadajte dátum v tvare dd.mm.rrrr!',
        },
        'driverPassword': {
            'required': 'Zadajte heslo!',
            'badPassword': 'Zadané heslo je nesprávne!'
        }
    };

    /**
     * function that provides update of driver's data
     */
    updateDriver(){
        let pictureUrl;
        if(this.pictureUUID){
            if(this.oldPictureUUID) {
                let storageOldRef = firebase.storage().ref().child('users/' + this.oldPictureUUID);
                storageOldRef.delete().catch((error) => console.log(error));
            }
            let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
            storageRef.getDownloadURL().then(url => {
                pictureUrl =  url;
            });
        }
        setTimeout(() => {
            if(this.driverEditForm.valid){
                this.af.auth.login({
                        email: firebase.auth().currentUser.email,
                        password: this.driverEditForm.value.driverPassword
                    },
                    {
                        provider: AuthProviders.Password,
                        method: AuthMethods.Password,
                    }).then(
                    (success) => {
                        this.driverEditForm.value.birthday = this.driverEditForm.value.birthday.jsdate;
                        this.toasterService.pop({
                            type: 'success',
                            title: this.driverEditForm.value.name,
                            body: 'Profil upravený,',
                            toastContainerId: 1
                        });
                        Drivers.update(this.context.driver._id, {
                            $set: {
                                name: this.driverEditForm.value.name,
                                birthday: this.driverEditForm.value.birthday,
                                sex: this.driverEditForm.value.sex,
                                picture: this.pictureUUID,
                                pictureUrl: pictureUrl
                            }
                        });
                    }, (error) => {
                        // console.log(error);
                        if (error['code'] === 'auth/wrong-password') {
                            this.formErrors['driverPassword'] += this.validationMessages['driverPassword']['badPassword'] + ' ';
                        }
                    });
            }
        }, 800);
    }

    /**
     * function that handles navigation request to ChangePasswordModalComponent
     */
    changePassword(){
        this.dialog.close();
        this.modal.open(ChangePasswordModalComponent, overlayConfigFactory({ user: 'driver' }, BSModalContext));
    }

    /**
     * function that handles navigation request to ChangeEmailModalComponent
     */
    changeEmail(){
        this.dialog.close();
        this.modal.open(ChangeEmailModalComponent, overlayConfigFactory({ user: 'driver' }, BSModalContext));
    }

    /**
     * function that logout current logged in driver
     */
    logout(){
        this.closeDialog();
        this.af.auth.logout();
        // console.log('logged out');
        this.router.navigateByUrl('/');
        this.toasterService.pop('success', 'Ďakujeme za návštevu!', 'Odhlásenie úspešné.');
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        let driver = Drivers.findOne(this.context.driver._id);
        this.context.driver.name = driver.name;
        this.context.driver.bus = driver.bus;
        this.context.driver.tram = driver.tram;
        this.context.driver.sex = driver.sex;
        this.context.driver.birthday = driver.birthday;
        this.dialog.close();
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
                        this.thumb_url = 'images/user.svg';
                    }
                    this.pictureUUID = this.oldPictureUUID;
                }else if(result === 'success'){
                    this.uploading = true;
                    let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
                    storageRef.getDownloadURL().then(url => {
                        this.uploading = false;
                        this.thumb_url = url;
                    });
                }
            }, () => console.log('Rejected!'));
        });
    }

    /**
     * function that handles file change
     * @param event - event of file change
     */
    onFileChange(event) {
        let files = event.srcElement.files;
        this.onFileDrop(files[0]);
        // console.log(files[0]);
        event.srcElement.files = null;
    }

    /**
     * function that handles dismiss operation of modal dialog
     * @returns {boolean}
     */
    beforeDismiss(): boolean {
        return true;
    }

    /**
     * function that handles dismiss operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}