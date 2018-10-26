import {Component, Inject} from '@angular/core';
import {ModalComponent, DialogRef, CloseGuard, Modal, overlayConfigFactory} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from './loginChoose.modal.component.web.html';
import style from './loginChoose.modal.component.web.scss';
import {DriverLoginModalComponent} from "../driverLoginModal/driverLogin.modal.component.web";
import {DispatcherLoginModalComponent} from "../dispatcherLoginModal/dispatcherLogin.modal.component.web";
import {RegisterModalComponent} from "../registerModal/register.modal.component.web";

/**
 * modal context for LoginChooseModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/21/17.
 */
export class CustomModalContext extends BSModalContext {
    public data: String[];
}

@Component({
    selector: 'login-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides choose to login as driver or as dispatcher
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 4/21/17.
 */
export class LoginChooseModalComponent implements CloseGuard, ModalComponent<CustomModalContext>{
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;

    /**
     * constructor of LoginChooseModalComponent
     *
     * @param modal - modal dialog handler
     * @param dialog - dialog reference to handle context
     */
    constructor(public modal: Modal, public dialog: DialogRef<CustomModalContext>) {
        this.context = dialog.context;

        dialog.setCloseGuard(this);
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
    }

    /**
     * function that handles navigation request to RegisterModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    registerClicked(){
        this.dialog.close();
        return this.modal.open(RegisterModalComponent, overlayConfigFactory({backComponent: "chooseLogin"}, BSModalContext));
    }

    /**
     * function that handles navigation request to DispatcherLoginModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    dispatcherLoginClicked(){
        this.dialog.close();
        return this.modal.open(DispatcherLoginModalComponent, overlayConfigFactory({ data: [] }, BSModalContext));
    }

    /**
     * function that handles navigation request to DriverLoginModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    driverLoginClicked(){
        this.dialog.close();
        return this.modal.open(DriverLoginModalComponent, overlayConfigFactory({ data: [] }, BSModalContext));
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