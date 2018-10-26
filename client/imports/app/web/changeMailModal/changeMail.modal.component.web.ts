import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./changeMail.modal.component.web.html";
import style from "./changeMail.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import * as firebase from "firebase";
import {ToasterService} from 'angular2-toaster';
import {EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";
import {DriverSettingsModalComponent} from "../driverSettingsModal/driverSettings.modal.component.web";
import {Dispatchers} from "../../../../../both/collections/dispatchers.collection";
import {Drivers} from "../../../../../both/collections/drivers.collection";

/**
 * modal context for ChangeEmailModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * identifier of user type
     * @type {string}
     */
    public user: string;
}

@Component({
    selector: 'change-email-modal',
    template,
    styleUrls: [style]
})

/**
 * modal dialog for change of password
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class ChangeEmailModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context for modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this modal dialog
     * @type {FormGroup}
     */
    private changeEmailForm: FormGroup;
    /**
     * stores error stacktrace
     * @type {any}
     */
    error: any;
    /**
     * check if show password is enabled or disabled
     * @type {boolean}
     */
    showPassword: boolean = false;
    /**
     * toaster service to handle toasters
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * new e-mail that should be changed to account
     * @type {string}
     */
    newEmail: string;
    /**
     * stores password from form input
     * @type {string}
     */
    password: string;
    /**
     * stores type of user
     * @type {string}
     */
    user: string;

    /**
     * constructor of ChangeEmailModalComponent
     *
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire) {
        this.context = dialog.context;
        this.toasterService = toasterService;
        this.user = this.context.user;
        this.changeEmailForm = fb.group({
            newEmail: [this.newEmail, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            password: [this.password, [Validators.required]]
        });
        this.changeEmailForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.changeEmailForm){
            return;
        }
        const form = this.changeEmailForm;

        for(const field in this.formErrors){
            this.formErrors[field] = '';
            const control = form.get(field);

            if(control && control.dirty && !control.valid){
                const messages = this.validationMessages[field];
                for (const key in control.errors){
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    /**
     * form errors divs
     * @type {{newEmail: string; password: string}}
     */
    formErrors = {
        'newEmail': '',
        'password': ''
    };

    /**
     * form error messages
     * @type {{newEmail: {required: string; pattern: string; alreadyUsed: string}; password: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'newEmail': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'alreadyUsed': 'Zadaný e-mail je už použítý!'
        },
        'password': {
            'required': 'Zadajte heslo!',
            'badPassword': 'Zadané heslo je nesprávne!'
        }
    };

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
    }

    /**
     * handler for back dialog button
     * @returns {Promise<DialogRef<any>>}
     */
    backToChoose() {
        this.dialog.close();
        if(this.user === 'driver'){
            return this.modal.open(DriverSettingsModalComponent, overlayConfigFactory({driver: Drivers.findOne({_id: firebase.auth().currentUser.uid})}, BSModalContext));
        }else if(this.user === 'dispatcher'){
            return this.modal.open(SettingsModalComponent, overlayConfigFactory({data: []}, BSModalContext));
        }
    }

    /**
     * function that provides email change functionality
     */
    changeEmail(){
        if(this.changeEmailForm.valid){
            let email = firebase.auth().currentUser.email;
            this.af.auth.login({
                    email: firebase.auth().currentUser.email,
                    password: this.changeEmailForm.value.password
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then((success) =>{
                    firebase.auth().currentUser.updateEmail(this.changeEmailForm.value.newEmail).then((success) => {
                        this.dialog.close();
                        if(this.user === 'driver'){
                            Drivers.update(Drivers.findOne({email: email})._id, {$set: {email: this.changeEmailForm.value.newEmail}})
                        }else if(this.user === 'dispatcher'){
                            Dispatchers.update(Dispatchers.findOne({email: email})._id, {$set: {email: this.changeEmailForm.value.newEmail}})
                        }
                        this.toasterService.pop({
                            type: 'success',
                            title: this.changeEmailForm.value.newEmail,
                            body: 'E-mail zmenený.',
                            toastContainerId: 1
                        });
                    }).catch((error) => {
                        if (error['code'] === 'auth/email-already-in-use') {
                            this.formErrors['email'] += this.validationMessages['newEmail']['alreadyUsed'] + ' ';
                        } else if (error['code'] === 'auth/invalid-email') {
                            this.formErrors['email'] += this.validationMessages['newEmail']['pattern'] + ' ';
                        }
                    });
                }).catch((error) => {
                    //console.log(error);
                    if(error['code'] === 'auth/wrong-password') {
                        this.formErrors['password'] += this.validationMessages['password']['badPassword'] + ' ';
                    }
                });
        }
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
     * function that handles dismiss operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}