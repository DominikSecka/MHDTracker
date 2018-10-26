import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./dispatcherLogin.modal.component.web.html";
import style from "./dispatcherLogin.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginChooseModalComponent} from "../loginChooseModal/loginChoose.modal.component.web";
import {ForgottenPasswordModalComponent} from "../forgottenPassword/forgottenPassword.modal.component.web";
import {RegisterModalComponent} from "../registerModal/register.modal.component.web";
import {Router} from "@angular/router";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {ToasterService} from 'angular2-toaster';
import {MeteorObservable} from "meteor-rxjs";
import {EMAIL_REGEXP} from "../driverLoginModal/driverLogin.modal.component.web";
import { Subscription } from 'rxjs/Subscription';


/**
 * modal context for DispatcherLoginModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/21/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * context data for DispatcherLoginModalComponent
     * @type {String[]}
     */
    public data: String[];
}

@Component({
    selector: 'login-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides dispatchers login functionality
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class DispatcherLoginModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of dispatcher login dialog form
     * @type {FormGroup}
     */
    private dispatcherLoginForm: FormGroup;
    /**
     * stores error messages stacktrace
     * @type {any}
     */
    error: any;
    /**
     * instance of toasterService
     * @type {ToasterService}
     */
    private toasterService: ToasterService;
    /**
     * stores state of show or hide password
     * @type {boolean}
     */
    showPassword: boolean = false;
    /**
     * stores email form input
     * @type {string}
     */
    email: string;
    /**
     * stores password from input
     * @type {string}
     */
    password: string;

    /**
     * constructor of DispatcherLoginModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire, private router: Router) {
        this.toasterService = toasterService;
        this.context = dialog.context;
        this.dispatcherLoginForm = fb.group({
            email: [this.email, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            password: [this.password, [Validators.required]]
        });
        this.dispatcherLoginForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.dispatcherLoginForm){
            return;
        }
        const form = this.dispatcherLoginForm;

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
     * @type {{email: string; password: string}}
     */
    formErrors = {
        'email': '',
        'password': ''
    };

    /**
     * form error messages
     * @type {{email: {required: string; pattern: string; unknownUser: string; notDispatcher: string}; password: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'email': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'unknownUser': 'Používateľ s týmto e-mailom nie je registrovaný!',
            'notDispatcher': 'Tento používateľ nie je registrovaný ako dispečer!'
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
        return this.modal.open(LoginChooseModalComponent, overlayConfigFactory({data: []}, BSModalContext));
    }

    /**
     * function that handles navigation request to ForgottenPasswordModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    forgotPassword() {
        this.dialog.close();
        return this.modal.open(ForgottenPasswordModalComponent, overlayConfigFactory({isDriver: false}, BSModalContext));
    }

    /**
     * function that handles navigation request to RegisterModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    registerClicked() {
        this.dialog.close();
        return this.modal.open(RegisterModalComponent, overlayConfigFactory({backComponent: "dispatcherLogin"}, BSModalContext));
    }

    /**
     * function that provides main functionality of dispatcher login
     */
    loginDispatcher() {
        if (this.dispatcherLoginForm.valid) {
            this.af.auth.logout();
            this.af.auth.login({
                    email: this.dispatcherLoginForm.value.email,
                    password: this.dispatcherLoginForm.value.password
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    // console.log(success);
                   let sub = MeteorObservable.call("getDispatcherName", success.uid).subscribe((response) => {
                        // Handle success and response from server!
                        if(response !== undefined){
                            this.dialog.close();
                            this.toasterService.pop({ type: 'success', title: 'Vitajte ' + response['name'], body: 'Prihlásenie úspešné.', toastContainerId: 1 });
                            this.router.navigate(['/dispatching']);
                            this.dispatcherLoginForm.value.un
                        }else{
                            this.af.auth.logout();
                            this.formErrors['email'] += this.validationMessages['email']['notDispatcher'] + ' ';
                        }
                    }, (err) => {
                        // Handle error
                        // console.log(err);
                    });
                }).catch(
                (err) => {
                    // console.log(err);
                    if(err['code'] === 'auth/wrong-password') {
                        this.formErrors['password'] += this.validationMessages['password']['badPassword'] + ' ';
                    } else if(err['code'] === 'auth/user-not-found'){
                        this.formErrors['email'] += this.validationMessages['email']['unknownUser'] + ' ';
                    } else if(err['code'] === 'auth/invalid-email'){
                        this.formErrors['email'] += this.validationMessages['email']['pattern'] + ' ';
                    }
                    this.error = err;
                })
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