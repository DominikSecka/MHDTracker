import {Component, Inject} from "@angular/core";
import {CloseGuard, DialogRef, ModalComponent} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import template from "./sendWarning.modal.component.web.html";
import style from "./sendWarning.modal.component.web.scss";
import * as firebase from "firebase";
import {FirebaseApp} from "angularfire2";

import {Headers, Http, RequestOptions} from "@angular/http";
import {ToasterService} from "angular2-toaster";

/**
 * modal context for WarningModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 3/4/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * driver's application token
     */
    public token: string;
}

@Component({
    selector: 'send-warning-modal',
    template,
    styleUrls: [style]
})

/**
 * component that provides functionality of Firebase Cloud Messaging
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 3/4/17.
 */
export class WarningModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * context that inputs required data to modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * stores content of notification body
     * @type {string}
     */
    message: string;
    /**
     * stores driver's token
     * @type {string}
     */
    driverToken: string;
    /**
     * stores instance of Firebase Cloud Messaging service
     * @type {firebase.messaging.Messaging}
     */
    private _messaging: firebase.messaging.Messaging;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;

    /**
     * constructor of WarningModalComponent
     *
     * @param dialog - dialog reference to handle context
     * @param http - http Angular2 client
     * @param _firebaseApp - instance of registered firebase app
     */
    constructor(public dialog: DialogRef<CustomModalContext>, toasterService: ToasterService, public http: Http, @Inject(FirebaseApp) private _firebaseApp: firebase.app.App) {
        this.context = dialog.context;
        this.toasterService = toasterService;
        // console.log(this.context.token);
        this.driverToken = this.context.token;
        this._messaging = firebase.messaging(this._firebaseApp);
        this._messaging.requestPermission()
            .then((response) => {
                // console.log(response);
                // console.log('got permission');
            })
            .catch((error) => {
                // console.log(error);
            });

        dialog.setCloseGuard(this);
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.dialog.close();
    }

    /**
     * function that sends notification to specific instance of native android application
     */
    sendWarning() {
        if (this.message.length != 0) {
            let url = "https://fcm.googleapis.com/fcm/send";
            let body =
                {
                    "notification": {
                        "title": "Notification title",
                        "body": this.message,
                        "sound": "default"
                    },
                    "to": this.context.token
                };

            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAABqgoh_8:APA91bFjMoXVh_676m_55wsQvPLBVzc4NPT05Sr5Nfq8wN6KspReHg3jLp2lPNo-yhDmwqeIfGoIW8KzHERbMWoaCtEPWxLENk28e1Q6hO6bEBiI_uxM_Sj-hYGl9RwXNuQ-N9SgA3an'
            });
            let options = new RequestOptions({headers: headers});

            this.http.post(url, body, options).map(response => {
                // console.log(response);
                return response;
            }).subscribe(response => {
                this.dialog.close();
                this.toasterService.pop({
                    type: 'success',
                    title: 'Upozornenie',
                    body: 'úspešne odoslané!',
                    toastContainerId: 1
                });
                // console.log(response);
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