import {Component, Inject, OnInit} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./addDriver.modal.component.web.html";
import style from "./addDriver.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {upload} from "../../../../../both/methods/images.methods";
import {Observable, Subject} from "rxjs";
import {Thumb} from "../../../../../both/models/image.model";
import {CropperModalComponent} from "../cropperModal/cropper.modal.component.web";
import {IMyDateModel, IMyOptions} from "mydatepicker";
import {ToasterService} from "angular2-toaster";
import {NAME_REGEXP} from "../registerModal/register.modal.component.web";
import {EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";
import * as firebase from "firebase";
import {UUID} from "angular2-uuid";

/**
 * context data model of AddDriverModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {

}

/**
 * validator for groups of checkboxes
 * Created by dominiksecka on 3/4/17.
 */
export class CheckboxValidator {
    /**
     * function to check if required checkboxes are checked
     * @param group - group of validated checkboxes
     * @returns {any}
     */
    public checkboxRequired(group: FormGroup) {
        let valid = false;

        for (let name in group.controls) {
            let val = group.controls[name].value;
            if (val) {
                valid = true;
                break;
            }
        }

        if (valid) {
            return null;
        }

        return {
            checkboxRequired: true
        };
    }
}

@Component({
    selector: 'add-driver-modal',
    template,
    styleUrls: [style]
})

/**
 * Component of modal dialog for creating new driver
 * @implements {CloseGuard, ModalComponent<CustomModalContext>, OnInit}
 * Created by dominiksecka on 3/4/17.
 */
export class AddDriverModalComponent implements CloseGuard, ModalComponent<CustomModalContext>, OnInit {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    private addDriverForm: FormGroup;
    /**
     * if {true} password is in visible form, otherwise hidden
     * @type {boolean}
     */
    showPassword: boolean;
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
     * stores uploaded file
     * @type {Subject<string>}
     */
    file: Subject<string> = new Subject<string>();
    /**
     * Observable cursor for thumbs collection
     * @type {Observable<Thumb[]>}
     */
    thumbs: Observable<Thumb[]>;
    /**
     * stores url of thumb
     * @type {string}
     */
    thumb_url: string;
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
     * stores driver's sex
     * @type {string}
     */
    sex: string = 'M';
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
     * stores datepicker date for birthday
     * @type {Date}
     */
    birthday: Date;
    /**
     * stores password from input
     * @type {string}
     */
    passwd: string;
    /**
     * stores retyped passwrod from input
     * @type {string}
     */
    retype_passwd: string;
    /**
     * stores dispatcher's password from input
     * @type {string}
     */
    dispatcherPassword: string;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores current logged dispatcher e-mail
     * @type {string}
     */
    currentDispatcherEmail: string;
    /**
     * specific uuid for profile picture of driver
     * @type {string}
     */
    pictureUUID: string;

    /**
     * options for myDatePicker
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
     * Constructor of add driver component
     *
     * @param checboxValidator - validator for check boxes
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(checboxValidator: CheckboxValidator, toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire) {
        this.showPassword = false;
        this.toasterService = toasterService;
        this.currentDispatcherEmail = firebase.auth().currentUser.email;
        this.addDriverForm = fb.group({
            name: [this.name, [Validators.required, Validators.pattern(NAME_REGEXP)]],
            email: [this.email, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            sex: [this.sex, [Validators.required]],
            vehicles: fb.group({
                bus: [this.bus],
                tram: [this.tram],
            }, {validator: checboxValidator.checkboxRequired}),
            avg_speed: [0],
            max_speed: [0],
            rating: [100],
            no_rides: [0],
            total_distance: [0],
            total_duration: [0],
            picture: [],
            passwd: [this.passwd, [Validators.required, Validators.minLength(8)]],
            retype_passwd: [this.retype_passwd, [Validators.required]],
            birthday: [this.birthday, [Validators.required]],
            dispatcherPassword: [this.dispatcherPassword, [Validators.required]]
        });
        this.addDriverForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();

        this.context = dialog.context;
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any) {
        if (!this.addDriverForm) {
            return;
        }
        const form = this.addDriverForm;

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
     * @type {{name: string; email: string; sex: string; vehicles: string; passwd: string; retype_passwd: string; birthday: string; dispatcherPassword: string}}
     */
    formErrors = {
        'name': '',
        'email': '',
        'sex': '',
        'vehicles': '',
        'passwd': '',
        'retype_passwd': '',
        'birthday': '',
        'dispatcherPassword': ''
    };

    /**
     * form errors messages
     * @type {{name: {required: string; pattern: string}; email: {required: string; pattern: string; alreadyUsed: string}; passwd: {required: string; minlength: string; weak: string}; retype_passwd: {required: string; validateEqual: string}; vehicles: {checkboxRequired: string}; birthday: {required: string}; dispatcherPassword: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'name': {
            'required': 'Zadajte meno nového dispečera!',
            'pattern': 'Uvedené meno nemá formu - meno a priezvisko!'
        },
        'email': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'alreadyUsed': 'Zadaný e-mail je už použítý!'
        },
        'passwd': {
            'required': 'Zadajte heslo!',
            'minlength': 'Heslo musí mať minimálne 8 znakov!',
            'weak': 'Zadali ste príliš slabé heslo!'
        },
        'retype_passwd': {
            'required': 'Zopakujte heslo!',
            'validateEqual': 'Uvedené heslá sa nezhodujú!'
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
     * handler for change date in myDatePicker
     * @param event
     */
    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
        if(this.pictureUUID) {
            firebase.storage().ref().child('users/' + this.pictureUUID).delete().catch((error) => console.log(error));
        }
        this.addDriverForm.reset();
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
                // console.log(result);
                // this.addFile(result);
                this.openCropper(result.url);
            })
            .catch((error) => {
                this.uploading = false;
                // console.log(`Something went wrong!`, error);
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
    }

    /**
     * function that is called on initialization of component
     */
    ngOnInit(): void {
        this.thumb_url = 'images/user.svg';
    }

    /**
     * function that provides adding of new driver functionality
     */
    addDriver() {
        let pictureUrl;
        if(this.pictureUUID){
            let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
            storageRef.getDownloadURL().then(url => {
                pictureUrl =  url;
            });
        }
        setTimeout(() => {
            if (this.addDriverForm.valid) {
                let driver = this.addDriverForm.value;
                this.af.auth.login({
                        email: firebase.auth().currentUser.email,
                        password: this.addDriverForm.value.dispatcherPassword
                    },
                    {
                        provider: AuthProviders.Password,
                        method: AuthMethods.Password,
                    }).then(
                    (success) => {
                        // console.log(success);
                        this.af.auth.createUser({
                            email: this.addDriverForm.value.email,
                            password: this.addDriverForm.value.passwd
                        })
                            .then((success) => {
                                driver._id = success.uid;
                                driver.birthday = this.addDriverForm.value.birthday.jsdate;
                                driver.bus = this.addDriverForm.value.vehicles.bus;
                                driver.tram = this.addDriverForm.value.vehicles.tram;
                                if(this.pictureUUID){
                                    driver.picture = this.pictureUUID;
                                    driver.pictureUrl = pictureUrl;
                                }
                                delete driver.vehicles;
                                delete driver.passwd;
                                delete driver.retype_passwd;
                                delete driver.dispatcherPassword;
                                Drivers.insert(driver);
                                this.dialog.close();
                                this.toasterService.pop({
                                    type: 'success',
                                    title: this.addDriverForm.value.name,
                                    body: 'Vodič registrovaný!',
                                    toastContainerId: 1
                                });
                                // this.af.auth.logout();
                                this.af.auth.login({
                                        email: this.currentDispatcherEmail,
                                        password: this.addDriverForm.value.dispatcherPassword
                                    },
                                    {
                                        provider: AuthProviders.Password,
                                        method: AuthMethods.Password,
                                    });
                            }, (error) => {
                                // console.log(error);
                                if (error['code'] === 'auth/email-already-in-use') {
                                    this.formErrors['email'] += this.validationMessages['email']['alreadyUsed'] + ' ';
                                } else if (error['code'] === 'auth/invalid-email') {
                                    this.formErrors['email'] += this.validationMessages['email']['pattern'] + ' ';
                                } else if (error['code'] === 'auth/weak-password') {
                                    this.formErrors['passwd'] += this.validationMessages['passwd']['weak'] + ' ';
                                }
                            });
                    }, (err) => {
                        // Handle error
                        // console.log(err);
                        if (err['code'] === 'auth/wrong-password') {
                            this.formErrors['dispatcherPassword'] += this.validationMessages['dispatcherPassword']['badPassword'] + ' ';
                        }
                    }).catch(
                    (err) => {
                        // console.log(err);
                    });
            }
        }, 800);
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
                    this.thumb_url = 'images/user.svg';
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
     * toggle function to show and hide password
     */
    showHidePasswd() {
        this.showPassword = !this.showPassword;
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