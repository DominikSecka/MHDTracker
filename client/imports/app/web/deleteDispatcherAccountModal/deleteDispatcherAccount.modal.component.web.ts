import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, Modal, ModalComponent, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./deleteDispatcherAccount.modal.component.web.html";
import style from "./deleteDispatcherAccount.modal.component.web.scss";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import * as firebase from "firebase";
import {MeteorObservable} from "meteor-rxjs";
import {ToasterService} from 'angular2-toaster';
import {DriverSettingsModalComponent} from "../driverSettingsModal/driverSettings.modal.component.web";
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {Router} from "@angular/router";

/**
 * modal context for DeleteDispatcherAccountModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 5/12/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * stores type of user
     * @type {string}
     */
    public user: string;
}

@Component({
    selector: 'delete-account-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides delete action on dispatcher account
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 5/12/17.
 */
export class DeleteDispatcherAccountModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores instance of form for this modal dialog
     * @type {FormGroup}
     */
    private deleteAccountForm: FormGroup;
    /**
     * stores error messages stacktrace
     * @type {any}
     */
    error: any;
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
     * constructor of DeleteDispatcherAccountModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     * @param fb - form builder to handle input values and validation
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(private router: Router, toasterService: ToasterService, public modal: Modal, public dialog: DialogRef<CustomModalContext>, @Inject(FormBuilder) fb: FormBuilder, public af: AngularFire) {
        this.context = dialog.context;
        this.toasterService = toasterService;
        this.user = this.context.user;
        this.deleteAccountForm = fb.group({
            password: [this.password, [Validators.required]]
        });
        this.deleteAccountForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        dialog.setCloseGuard(this);
    }

    /**
     * function that provides reactive displaying of error messages
     * @param data - data from form
     */
    onValueChanged(data?: any){
        if(!this.deleteAccountForm){
            return;
        }
        const form = this.deleteAccountForm;

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
     * @type {{password: string}}
     */
    formErrors = {
        'password': '',
    };

    /**
     * form error messages
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
        return this.modal.open(SettingsModalComponent, overlayConfigFactory({data: []}, BSModalContext));
    }

    /**
     * toggle function to show and hide password
     */
    showHidePasswd() {
        this.showPassword = !this.showPassword;
    }

    /**
     * function that provides delete operation of dispatcher account
     */
    deleteAccount(){
        if(this.deleteAccountForm.valid){
            this.af.auth.login({
                    email: firebase.auth().currentUser.email,
                    password: this.deleteAccountForm.value.password
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    firebase.auth().currentUser.delete().then((success) => {
                        this.dialog.close();
                        this.router.navigate(['/intro']);
                        this.toasterService.pop({ type: 'success', title: 'Váš účet bol', body: 'Úspešne odstránený.', toastContainerId: 1 });
                        this.toasterService.pop({ type: 'info', title: 'Tešíme sa na', body: 'Ďalšiu návštevu.', toastContainerId: 1 });
                    }).catch((error) => {
                        // console.log(error)
                    })
                }).catch(
                (err) => {
                    // console.log(err);
                    if(err['code'] === 'auth/wrong-password') {
                        this.formErrors['password'] += this.validationMessages['password']['badPassword'] + ' ';
                    }
                })
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
     * function that handles dismiss operation of modal dialog
     * @returns {boolean}
     */
    beforeClose(): boolean {
        return false;
    }
}