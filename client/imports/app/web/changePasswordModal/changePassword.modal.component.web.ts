import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./changePassword.modal.component.web.html";
import style from "./changePassword.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import * as firebase from "firebase";
import {MeteorObservable} from "meteor-rxjs";
import {ToasterService} from 'angular2-toaster';
import {DriverSettingsModalComponent} from "../driverSettingsModal/driverSettings.modal.component.web";
import {Drivers} from "../../../../../both/collections/drivers.collection";

/**
 * modal context for ChangePasswordModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/29/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * identifier of user type
     * @type {string}
     */
    public user: string;
}

@Component({
    selector: 'change-password-modal',
    template,
    styleUrls: [style]
})

/**
 * modal dialog that provides password change functionality
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/29/17.
 */
export class ChangePasswordModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of change password dialog form
     * @type {FormGroup}
     */
    private changePasswordForm: FormGroup;
    /**
     * stores error messages stacktrace
     * @type {any}
     */
    error: any;
    /**
     * stores state of show or hide new password
     * @type {boolean}
     */
    showNewPassword: boolean = false;
    /**
     * stores state of show or hide old password
     * @type {boolean}
     */
    showOldPassword: boolean = false;
    /**
     * instance of toasterService
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores old password from form input
     * @type {string}
     */
    oldPassword: string;
    /**
     * stores new passwrod from form input
     * @type {string}
     */
    newPassword: string;
    /**
     * stores retyped new password from form input
     * @type {string}
     */
    retypedPassword: string;
    /**
     * stores type of user
     * @type {string}
     */
    user: string;

    /**
     * constructor of ChangePasswordModalComponent
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
        this.changePasswordForm = fb.group({
            oldPassword: [this.oldPassword, [Validators.required]],
            newPassword: [this.newPassword, [Validators.required, Validators.minLength(8)]],
            retypedPassword: [this.retypedPassword, [Validators.required]]
        });
        this.changePasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.changePasswordForm){
            return;
        }
        const form = this.changePasswordForm;

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
     * form error divs
     * @type {{oldPassword: string; newPassword: string; retypedPassword: string}}
     */
    formErrors = {
        'oldPassword': '',
        'newPassword': '',
        'retypedPassword': ''
    };

    /**
     * form error messages
     * @type {{newPassword: {required: string; minlength: string; weak: string}; retypedPassword: {required: string; validateEqual: string}; oldPassword: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'newPassword': {
            'required': 'Zadajte heslo!',
            'minlength': 'Heslo musí mať minimálne 8 znakov!',
            'weak': 'Zadali ste príliš slabé heslo!'
        },
        'retypedPassword': {
            'required': 'Zopakujte heslo!',
            'validateEqual': 'Uvedené heslá sa nezhodujú!'
        },
        'oldPassword': {
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
     * function that provides mail functionality of this modal dialog to change password for account
     */
    changePassword() {
        if(this.changePasswordForm.valid) {
            this.af.auth.login({
                    email: firebase.auth().currentUser.email,
                    password: this.changePasswordForm.value.oldPassword
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    // console.log(success);
                    this.dialog.close();
                    if(this.changePasswordForm.value.newPassword === this.changePasswordForm.value.retypedPassword) {
                        firebase.auth().currentUser.updatePassword(this.changePasswordForm.value.newPassword).catch((error) =>{
                            // console.log(error);
                            this.toasterService.pop({ type: 'error', title: 'Vaše heslo sa', body: 'Nepodarilo zmeniť.', toastContainerId: 1 });
                        });
                        this.toasterService.pop({ type: 'success', title: 'Vaše heslo bolo', body: 'Úspešne zmenené.', toastContainerId: 1 });
                    }
                }).catch(
                (err) => {
                    // console.log(err);
                    if(err['code'] === 'auth/wrong-password') {
                        this.formErrors['oldPassword'] += this.validationMessages['oldPassword']['badPassword'] + ' ';
                    }
                })
        }
    }

    /**
     * toggle function to show and hide new password
     */
    showHideNewPasswd() {
        this.showNewPassword = !this.showNewPassword;
    }

    /**
     * toggle function to show and hide old password
     */
    showHideOldPasswd() {
        this.showOldPassword = !this.showOldPassword;
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