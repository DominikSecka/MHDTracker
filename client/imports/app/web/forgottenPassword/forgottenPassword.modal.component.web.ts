import {Component, Inject} from '@angular/core';
import {ModalComponent, DialogRef, CloseGuard, Modal, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from './forgottenPassword.modal.component.web.html';
import style from './forgottenPassword.modal.component.web.scss';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {DriverLoginModalComponent, EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";
import {DispatcherLoginModalComponent} from "../dispatcherLoginModal/dispatcherLogin.modal.component.web";
import {AngularFire} from 'angularfire2';
import * as firebase from "firebase";
import {ToasterService, ToasterConfig} from 'angular2-toaster';

/**
 * modal context for ForgottenPasswordModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * if {true} user is driver, otherwise dispatcher
     * @type {boolean}
     */
    public isDriver: boolean;
}

@Component({
    selector: 'forgotten-password-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides service to change password for account
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class ForgottenPasswordModalComponent implements CloseGuard, ModalComponent<CustomModalContext>{
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this dialog
     * @type {FormGroup}
     */
    private forgotPasswordForm: FormGroup;
    /**
     * stores state of e-mail sending
     * @type {boolean}
     */
    resend: boolean = false;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores e-mail from form
     * @type {string}
     */
    email: string;
    /**
     * configuration of toaster service
     * @type {ToasterConfig}
     */
    public toasterconfig : ToasterConfig =
        new ToasterConfig({
            showCloseButton: false,
            tapToDismiss: false,
            positionClass: "toast-top-left",
            timeout: 5000,
            mouseoverTimerStop: false,
            toastContainerId: 2
        });

    /**
     * constructor of ForgottenPasswordModalComponent
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
        this.forgotPasswordForm = fb.group({
            email: [this.email, [Validators.required, Validators.pattern(EMAIL_REGEXP)]]
        });
        this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.forgotPasswordForm){
            return;
        }
        const form = this.forgotPasswordForm;

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
     * @type {{email: string}}
     */
    formErrors = {
        'email': ''
    };

    /**
     * form error messages
     * @type {{email: {required: string; pattern: string; unknownUser: string}}}
     */
    validationMessages = {
        'email': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'unknownUser': 'Používateľ s týmto e-mailom nie je registrovaný!'
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
    backToChoose(){
        this.dialog.close();
        return this.modal.open(this.context.isDriver ? DriverLoginModalComponent : DispatcherLoginModalComponent, overlayConfigFactory({ data: [] }, BSModalContext));
    }

    /**
     * function that provides functionality of sending e-mail with information about renew user password
     */
    sendEmail(){
        if(this.forgotPasswordForm.valid) {
            firebase.auth().sendPasswordResetEmail(this.forgotPasswordForm.value.email)
                .then(() => {
                    this.toasterService.pop({ type: 'success', title: this.forgotPasswordForm.value.email, body: 'E-mail odoslaný!', toastContainerId: 2 });
                    if(!this.resend){
                        this.resend = true;
                    }
                }, (error) => {
                    // console.log(error);
                        if(error['code'] === 'auth/user-not-found') {
                            this.formErrors['email'] += this.validationMessages['email']['unknownUser'] + ' ';
                        }
                        return;
                });
        }
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