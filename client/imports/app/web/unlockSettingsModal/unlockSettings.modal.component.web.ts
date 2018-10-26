/**
 * Created by dominiksecka on 4/29/17.
 */
import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./unlockSettings.modal.component.web.html";
import style from "./unlockSettings.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import * as firebase from "firebase";
import {ToasterService} from 'angular2-toaster';
import {EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";

/**
 * context data model of UnlockSettingsModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/21/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * data model for this modal component
     * @type {Array<string>}
     */
    public data: String[];
}

@Component({
    selector: 'unlock-settings-modal',
    template,
    styleUrls: [style]
})

/**
 * component that unlocks settings for edit
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class UnlockSettingsModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    private unlockForm: FormGroup;
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
     * stores email from input
     * @type {string}
     */
    newEmail: string;
    /**
     * stores password from input
     * @type {string}
     */
    password: string;

    /**
     * constructor for UnlockSettingsModalComponent
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
        this.unlockForm = fb.group({
            password: [this.password, [Validators.required]]
        });
        this.unlockForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.unlockForm){
            return;
        }
        const form = this.unlockForm;

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
     * @type {{password: string}}
     */
    formErrors = {
        'password': ''
    };

    /**
     * form errors messages
     * @type {{password: {required: string; badPassword: string}}}
     */
    validationMessages = {
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
        this.modal.open(SettingsModalComponent, overlayConfigFactory({ id: 'id', unlocked: false}, BSModalContext));
    }

    /**
     * function that unlocks settings for editing
     */
    unlockSettings(){
        if(this.unlockForm.valid){
            this.af.auth.login({
                    email: firebase.auth().currentUser.email,
                    password: this.unlockForm.value.password
                }, {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then((success) =>{
                    this.dialog.close();
                    this.modal.open(SettingsModalComponent, overlayConfigFactory({ id: 'id', unlocked: true}, BSModalContext));
                    this.toasterService.pop({
                        type: 'success',
                        title: 'Nastavenia boli',
                        body: 'Odomknuté!',
                        toastContainerId: 1
                    });
                }).catch((error) => {
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
     * function that handles close operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}