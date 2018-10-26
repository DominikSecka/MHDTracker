import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Driver} from "../../../../../both/models/driver.model";
import {upload} from "../../../../../both/methods/images.methods";
import template from "./editDriver.modal.component.web.html";
import style from "./editDriver.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {IMyDateModel, IMyOptions} from "mydatepicker";
import {CropperModalComponent} from "../cropperModal/cropper.modal.component.web";
import {ToasterService} from "angular2-toaster";
import {NAME_REGEXP} from "../registerModal/register.modal.component.web";
import {CheckboxValidator} from "../addDriverModal/addDriver.modal.component.web";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import * as firebase from "firebase";
import {UUID} from "angular2-uuid";

/**
 * modal context for EditDriverModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {
    public driver: Driver;
}

@Component({
    selector: 'edit-driver-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides functionality of edit driver's data in database
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 3/4/17.
 */
export class EditDriverModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    editDriverForm: FormGroup;
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
     * stores datepicker date for birthday
     * @type {Date}
     */
    birthday: Date;
    /**
     * stores driver's name from input
     * @type {string}
     */
    name: string;
    /**
     * stores driver's e-mail from input
     * @type {string}
     */
    email: string;
    /**
     * specific uuid for old profile picture of driver
     * @type {string}
     */
    oldPictureUUID: string;
    /**
     * stores driver's sex
     * @type {string}
     */
    sex: string;
    /**
     * stores bus checkbox value
     * @type {boolean}
     */
    bus: boolean;
    /**
     * stores tram checkbox value
     * @type {boolean}
     */
    tram: boolean;
    /**
     * stpres dospatcher's password from input
     * @type {strings}
     */
    dispatcherPassword: string;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * specific uuid for profile picture of driver
     * @type {string}
     */
    pictureUUID: string;

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
     * constructor of EditDriverModalComponent
     *
     * @param checboxValidator - validator for check boxes
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(checboxValidator: CheckboxValidator, toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire) {
        this.toasterService = toasterService;
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


        this.editDriverForm = fb.group({
            name: [this.context.driver.name, [Validators.required, Validators.pattern(NAME_REGEXP)]],
            sex: [this.context.driver.sex, [Validators.required]],
            vehicles: fb.group({
                bus: [this.context.driver.bus],
                tram: [this.context.driver.tram],
            }, {validator: checboxValidator.checkboxRequired}),
            birthday: [this.context.driver.birthday ? this.context.driver.birthday : '', [Validators.required]],
            dispatcherPassword: [this.dispatcherPassword, [Validators.required]]
        });

        this.editDriverForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any) {
        if (!this.editDriverForm) {
            return;
        }
        const form = this.editDriverForm;

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
     * form error divs
     * @type {{name: string; sex: string; vehicles: string; birthday: string; dispatcherPassword: string}}
     */
    formErrors = {
        'name': '',
        'sex': '',
        'vehicles': '',
        'birthday': '',
        'dispatcherPassword': ''
    };

    /**
     * form error messages
     * @type {{name: {required: string; pattern: string}; vehicles: {checkboxRequired: string}; birthday: {required: string}; dispatcherPassword: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'name': {
            'required': 'Zadajte meno nového dispečera!',
            'pattern': 'Uvedené meno nemá formu - meno a priezvisko!'
        },
        'vehicles': {
            'checkboxRequired': 'Vyberte jedno alebo všetky!'
        },
        'birthday': {
            'required': 'Zadajte dátum v tvare dd.mm.rrrr!',
        },
        'dispatcherPassword': {
            'required': 'Zadajte heslo!',
            'badPassword': 'Zadané heslo je nesprávne!'
        }
    };

    /**
     * function that handled date change in date picker
     * @param event - event of changing date
     */
    onDateChanged(event: IMyDateModel) {
        this.editDriverForm.value.birthday = event.jsdate;
        //console.log(event.jsdate);
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        if(this.pictureUUID){
            let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
            storageRef.delete();
        }
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
        var files = event.srcElement.files;
        this.onFileDrop(files[0]);
        // console.log(files[0]);
        event.srcElement.files = null;
    }

    /**
     * function that provides update of driver's data
     */
    updateDriver() {
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
            if (this.editDriverForm.valid) {

                this.af.auth.login({
                        email: firebase.auth().currentUser.email,
                        password: this.editDriverForm.value.dispatcherPassword
                    },
                    {
                        provider: AuthProviders.Password,
                        method: AuthMethods.Password,
                    })
                    .then((success) => {
                        this.editDriverForm.value.birthday = this.editDriverForm.value.birthday.jsdate;
                        // console.log(this.editDriverForm.value.birthday);
                        this.toasterService.pop({ type: 'success', title: this.editDriverForm.value.name, body: 'Profil upravený.', toastContainerId: 1 });
                        Drivers.update(this.context.driver._id, {$set: {bus: this.editDriverForm.value.vehicles.bus,
                            tram: this.editDriverForm.value.vehicles.tram,
                            birthday: this.editDriverForm.value.birthday,
                            name: this.editDriverForm.value.name,
                            sex: this.editDriverForm.value.sex,
                            picture: this.pictureUUID,
                            pictureUrl: pictureUrl
                        }});
                        this.dialog.close();
                    }, (error) => {
                        // console.log(error);
                        if (error['code'] === 'auth/wrong-password') {
                            this.formErrors['dispatcherPassword'] += this.validationMessages['dispatcherPassword']['badPassword'] + ' ';
                        }
                    });
            }
        }, 800);
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