
import {Component} from '@angular/core';
import {ModalComponent, DialogRef, CloseGuard} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from './deleteDriver.modal.component.web.html';
import style from './deleteDriver.modal.component.web.scss';
import {Drivers} from "../../../../../both/collections/drivers.collection";
import {AngularFire} from "angularfire2";
import {MeteorObservable} from "meteor-rxjs";
import {ToasterService} from "angular2-toaster";
import * as firebase from "firebase";

/**
 * modal context for DeleteDriverModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/5/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * identifier of driver
     * @type {string}
     */
    public id: string;
    /**
     * name of driver
     * @type {string}
     */
    public name: string;
    /**
     * driver's profile photo identifier
     * @type {string}
     */
    public picture: string;
    /**
     * driver's profile photo download url
     * @type {string}
     */
    public pictureUrl: string;
}

@Component({
    selector: 'delete-driver-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides delete operation of driver
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 3/5/17.
 */
export class DeleteDriverModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * instance of toasterService
     * @type {ToasterService}
     */
    toasterService: ToasterService;

    /**
     * constructor of DeleteDriverModalComponent
     *
     * @param toasterService - service to display toasts produced from action
     * @param dialog - dialog reference to handle context
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public dialog: DialogRef<CustomModalContext>, public af: AngularFire) {
        this.context = dialog.context;
        this.toasterService = toasterService;
        dialog.setCloseGuard(this);
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
    }

    /**
     * function that removes driver from system
     */
    deleteDriver() {
        // admin.auth().deleteUser(this.context.id);
        MeteorObservable.call("deleteDriver", this.context.id).subscribe((response) => {
            // Handle success and response from server!
            Drivers.remove(this.context.id);
            firebase.storage().ref().child('users/' + this.context.picture).delete();
            this.toasterService.pop({ type: 'success', title: 'Vodič bol úspešne', body: 'Odstránený!', toastContainerId: 1 });
            this.dialog.close();
        }, (err) => {
            // Handle error
            console.log(err);
        });
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
