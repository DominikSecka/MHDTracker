import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./driverLogin.modal.component.web.html";
import style from "./driverLogin.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginChooseModalComponent} from "../loginChooseModal/loginChoose.modal.component.web";
import {ForgottenPasswordModalComponent} from "../forgottenPassword/forgottenPassword.modal.component.web";
import {Router} from "@angular/router";
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {MeteorObservable} from "meteor-rxjs";
import {ToasterService} from 'angular2-toaster';

/**
 * modal context for DriverLoginModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/27/17.
 */
export class CustomModalContext extends BSModalContext {
    public data: String[];
}

/**
 * regexp for email validation
 * @type {RegExp}
 */
export const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'login-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides driver login functionality
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/27/17.
 */
export class DriverLoginModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of driver login dialog form
     * @type {FormGroup}
     */
    private driverLoginForm: FormGroup;
    /**
     * stores error messages stacktrace
     * @type {any}
     */
    error: any;
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
     * stores state of show or hide password
     * @type {boolean}
     */
    showPassword: boolean = false;
    /**
     * instance of toasterService
     * @type {ToasterService}
     */
    private toasterService: ToasterService;

    /**
     * constructor of DriverLoginModalComponent
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
        this.driverLoginForm = fb.group({
            email: [this.email, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
            password: [this.password, [Validators.required]]
        });
        this.driverLoginForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();

        dialog.setCloseGuard(this);
    }

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
     * function that provides main functionality of driver login
     */
    loginDriver() {
        if(this.driverLoginForm.valid) {
            this.af.auth.logout();
            // console.log(this.driverLoginForm.value);
            this.af.auth.login({
                    email: this.driverLoginForm.value.email,
                    password: this.driverLoginForm.value.password
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    // console.log(success);
                    MeteorObservable.call("getDriverName", success.uid).subscribe((response) => {
                        // Handle success and response from server!
                        if(response !== undefined) {
                            this.dialog.close();
                            this.toasterService.pop({
                                type: 'success',
                                title: 'Vitajte ' + response['name'],
                                body: 'Prihlásenie úspešné.',
                                toastContainerId: 1
                            });
                            this.router.navigate(['/statistics/' + success.uid + '/driver']);
                        }else{
                            this.af.auth.logout();
                            this.formErrors['email'] += this.validationMessages['email']['notDriver'] + ' ';
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
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.driverLoginForm){
            return;
        }
        const form = this.driverLoginForm;

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
     * @type {{email: {required: string; pattern: string; unknownUser: string; notDriver: string}; password: {required: string; badPassword: string}}}
     */
    validationMessages = {
        'email': {
            'required': 'Zadajte e-mail!',
            'pattern': 'E-mailová adresa má zlý formát!',
            'unknownUser': 'Používateľ s týmto e-mailom nie je registrovaný!',
            'notDriver': 'Tento používateľ nie je registrovaný ako vodič!'
        },
        'password': {
            'required': 'Zadajte heslo!',
            'badPassword': 'Zadané heslo je nesprávne!'
        }
    };

    /**
     * toggle function to show and hide password
     */
    showHidePasswd() {
        this.showPassword = !this.showPassword;
    }

    /**
     * function that handles navigation request to ForgottenPasswordModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    forgotPassword() {
        this.dialog.close();
        return this.modal.open(ForgottenPasswordModalComponent, overlayConfigFactory({isDriver: true}, BSModalContext));
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