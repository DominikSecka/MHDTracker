import {Component, Inject, OnInit} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./register.modal.component.web.html";
import style from "./register.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DispatcherLoginModalComponent} from "../dispatcherLoginModal/dispatcherLogin.modal.component.web";
import {LoginChooseModalComponent} from "../loginChooseModal/loginChoose.modal.component.web";
import {Router} from "@angular/router";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {ToasterService} from "angular2-toaster";
import {Dispatchers} from "../../../../../both/collections/dispatchers.collection";
import {EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";
import {MeteorObservable} from "meteor-rxjs";
import {upload} from "../../../../../both/methods/images.methods";
import {UUID} from "angular2-uuid";
import {CropperModalComponent} from "../cropperModal/cropper.modal.component.web";
import * as firebase from "firebase";

/**
 * modal context for RegisterModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/21/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * type of previous component
     * @type {string}
     */
    public backComponent: string;
}

/**
 * regexp for name validation
 * @type {RegExp}
 */
export const NAME_REGEXP = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńňľťòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+\s[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńňľťòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/;

@Component({
    selector: 'register-modal',
    template,
    styleUrls: [style]
})

/**
 * componenet that provides registration for dispatchers
 * @implements {OnInit, CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class RegisterModalComponent implements OnInit, CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    private registrationForm: FormGroup;
    /**
     * if {true} password is in visible form, otherwise hidden
     * @type {boolean}
     */
    showPassword: boolean;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores name of new user from input
     * @type {string}
     */
    newUserName: string;
    /**
     * stores email of new user from input
     * @type {string}
     */
    newUserEmail: string;
    /**
     * stores password of new user from input
     * @type {string}
     */
    newUserPassword: string;
    /**
     * stores retyped password of new user from input
     * @type {string}
     */
    newUserRetypePassword: string;
    /**
     * stores email of dispatcher from input
     * @type {string}
     */
    dispatcherEmail: string;
    /**
     * stores password of dispatcher from input
     * @type {string}
     */
    dispatcherPassword: string;
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
     * specific uuid for profile picture of driver
     * @type {string}
     */
    pictureUUID: string;
    /**
     * stores url of thumb
     * @type {string}
     */
    thumb_url: string;

    /**
     * constructor of RegisterModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire, private router: Router) {
        this.context = dialog.context;
        this.toasterService = toasterService;
        this.registrationForm = fb.group({
            newUserName: [this.newUserName, [Validators.required, Validators.pattern(NAME_REGEXP)]],
            newUserEmail: [this.newUserEmail, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            newUserPassword: [this.newUserPassword, [Validators.required, Validators.minLength(8)]],
            newUserRetypePassword: [this.newUserRetypePassword, [Validators.required]],
            dispatcherEmail: [this.dispatcherEmail, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            dispatcherPassword: [this.dispatcherPassword, [Validators.required]]
        });
        this.registrationForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any) {
        if (!this.registrationForm) {
            return;
        }
        const form = this.registrationForm;

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
     * @type {{newUserName: string; newUserEmail: string; newUserPassword: string; newUserRetypePassword: string; dispatcherEmail: string; dispatcherPassword: string}}
     */
    formErrors = {
        'newUserName': '',
        'newUserEmail': '',
        'newUserPassword': '',
        'newUserRetypePassword': '',
        'dispatcherEmail': '',
        'dispatcherPassword': '',
    };

    /**
     * form error messages
     * @type {{newUserName: {required: string; pattern: string}; newUserEmail: {required: string; pattern: string; alreadyUsed: string}; newUserPassword: {required: string; minlength: string; weak: string}; newUserRetypePassword: {required: string; validateEqual: string}; dispatcherEmail: {required: string; pattern: string; unknownUser: string; notDispatcher: string}; dispatcherPassword: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'newUserName': {
            'required': 'Zadajte meno nového dispečera!',
            'pattern': 'Uvedené meno nemá formu - meno a priezvisko!'
        },
        'newUserEmail': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'alreadyUsed': 'Zadaný e-mail je už použítý!'
        },
        'newUserPassword': {
            'required': 'Zadajte heslo!',
            'minlength': 'Heslo musí mať minimálne 8 znakov!',
            'weak': 'Zadali ste príliš slabé heslo!'
        },
        'newUserRetypePassword': {
            'required': 'Zopakujte heslo!',
            'validateEqual': 'Uvedené heslá sa nezhodujú!'
        },
        'dispatcherEmail': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'unknownUser': 'Používateľ s týmto e-mailom nie je registrovaný!',
            'notDispatcher': 'Tento používateľ nie je registrovaný ako dispečer!'
        },
        'dispatcherPassword': {
            'required': 'Zadajte heslo!',
            'badPassword': 'Zadané heslo je nesprávne!'
        }
    };

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
        if (this.pictureUUID) {
            this.af.auth.login({
                    email: 'admin.admin@firebase.com',
                    password: 'Fialka12'
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    firebase.storage().ref().child('users/' + this.pictureUUID).delete().catch((error) => console.log(error));
                    this.af.auth.logout();
                }).catch(
                (err) => {
                    // console.log(err);
                });
        }
        this.registrationForm.reset();
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
                //console.log(result);
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
        var files = event.srcElement.files;
        this.onFileDrop(files[0]);
        // console.log(files[0]);
    }

    /**
     * handler for navigation request to CropperModalComponent
     * @param url - url of selected file
     * @returns {Promise<DialogRef<any>>}
     */
    openCropper(url: string) {
        if (!this.pictureUUID) {
            this.pictureUUID = UUID.UUID();
        }
        this.af.auth.login({
                email: 'admin.admin@firebase.com',
                password: 'Fialka12'
            },
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
            }).then(
            (success) => {
                let dialog = this.modal.open(CropperModalComponent, overlayConfigFactory({
                    file_url: url,
                    uuid: this.pictureUUID
                }, BSModalContext));
                dialog.then((resultPromise) => {
                    resultPromise.result.then((result) => {
                        // console.log(result);
                        if (result === 'cancel') {
                            this.thumb_url = 'images/dispatcher.svg';
                            this.af.auth.logout();
                        } else if (result === 'success') {
                            this.uploading = true;
                            let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
                            storageRef.getDownloadURL().then(url => {
                                this.uploading = false;
                                this.thumb_url = url;
                                this.af.auth.logout();
                            });
                        }
                    }, () => console.log('Rejected!'));
                });
            }).catch(
            (err) => {
                // console.log(err);
            });

    }

    /**
     * function that is called on initialization of component
     */
    ngOnInit(): void {
        this.thumb_url = 'images/dispatcher.svg';
    }

    /**
     * handler for back dialog button
     * @returns {Promise<DialogRef<any>>}
     */
    backToChoose() {
        this.dialog.close();
        if (this.context.backComponent !== "intro") {
            return this.modal.open(this.context.backComponent === 'dispatcherLogin' ? DispatcherLoginModalComponent : LoginChooseModalComponent, overlayConfigFactory({data: []}, BSModalContext));
        }
    }

    /**
     * toggle function to show and hide password
     */
    showHidePasswd() {
        this.showPassword = !this.showPassword;
    }

    /**
     * function that provides registration of new user
     */
    registerNewUser() {
        let pictureUrl;
        if (this.pictureUUID) {
            let storageRef = firebase.storage().ref().child('users/' + this.pictureUUID);
            storageRef.getDownloadURL().then(url => {
                pictureUrl = url;
            });
        }
        setTimeout(() => {
            if (this.registrationForm.valid) {
                if (this.registrationForm.value.newUserPassword === this.registrationForm.value.newUserRetypePassword) {
                    this.af.auth.login({
                            email: this.registrationForm.value.dispatcherEmail,
                            password: this.registrationForm.value.dispatcherPassword
                        },
                        {
                            provider: AuthProviders.Password,
                            method: AuthMethods.Password,
                        }).then(
                        (success) => {
                            // console.log(success);
                            MeteorObservable.call("getDispatcherName", success.uid).subscribe((response) => {
                                // Handle success and response from server!
                                if (response !== undefined) {
                                    this.af.auth.createUser({
                                        email: this.registrationForm.value.newUserEmail,
                                        password: this.registrationForm.value.newUserPassword
                                    })
                                        .then((success) => {
                                            Dispatchers.insert({
                                                id: success.uid,
                                                name: this.registrationForm.value.newUserName,
                                                email: this.registrationForm.value.newUserEmail,
                                                picture: this.pictureUUID,
                                                pictureUrl: pictureUrl
                                            });
                                            this.dialog.close();
                                            this.toasterService.pop({
                                                type: 'success',
                                                title: this.registrationForm.value.newUserName,
                                                body: 'Registrácia úspešná.',
                                                toastContainerId: 1
                                            });
                                            this.toasterService.pop({
                                                type: 'info',
                                                title: 'Výborne a teraz sa možete',
                                                body: 'Prihlásiť ako dispečer.',
                                                toastContainerId: 1
                                            });
                                        }, (err) => {
                                            // console.log(err);
                                            if (err['code'] === 'auth/email-already-in-use') {
                                                this.formErrors['newUserEmail'] += this.validationMessages['newUserEmail']['alreadyUsed'] + ' ';
                                            } else if (err['code'] === 'auth/invalid-email') {
                                                this.formErrors['newUserEmail'] += this.validationMessages['newUserEmail']['pattern'] + ' ';
                                            } else if (err['code'] === 'auth/weak-password') {
                                                this.formErrors['newUserPassword'] += this.validationMessages['newUserPassword']['weak'] + ' ';
                                            }
                                        })
                                } else {
                                    this.af.auth.logout();
                                    this.formErrors['dispatcherEmail'] += this.validationMessages['dispatcherEmail']['notDispatcher'] + ' ';
                                }
                            }, (err) => {
                                // Handle error
                                // console.log(err);
                            });
                        }, (err) => {
                            // Handle error
                            // console.log(err);
                            if (err['code'] === 'auth/wrong-password') {
                                this.formErrors['dispatcherPassword'] += this.validationMessages['dispatcherPassword']['badPassword'] + ' ';
                            } else if (err['code'] === 'auth/user-not-found') {
                                this.formErrors['dispatcherEmail'] += this.validationMessages['dispatcherEmail']['unknownUser'] + ' ';
                            } else if (err['code'] === 'auth/invalid-email') {
                                this.formErrors['dispatcherEmail'] += this.validationMessages['dispatcherEmail']['pattern'] + ' ';
                            }
                        }).catch(
                        (err) => {
                            // console.log(err);
                        });
                    this.af.auth.logout();
                }
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
     * function that handles close operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}