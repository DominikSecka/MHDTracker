import {Component, ViewChild} from "@angular/core";
import {CloseGuard, DialogRef, ModalComponent} from "angular2-modal";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Bounds, CropperSettings, ImageCropperComponent} from "ng2-img-cropper";

import template from "./cropper.modal.component.web.html";
import style from "./cropper.modal.component.web.scss";
import {Image} from "../../../../../both/models/image.model";
import * as firebase from "firebase";
import {ToasterService} from "angular2-toaster";
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";

/**
 * modal context for CropperModalComponent
 * @extends {BSModalContext}
 * Created by dominiksecka on 4/29/17.
 */
export class CustomModalContext extends BSModalContext {
    /**
     * url to picture file
     * @type {string}
     */
    public file_url: string;
    /**
     * specific identifier for picture file
     * @type {string}
     */
    public uuid: string;
}

@Component({
    selector: 'cropper-modal',
    template,
    styleUrls: [style]
})

/**
 * component of picture cropper
 * @implements {CloseGuard, ModalComponent<CustomModalContext>}
 * Created by dominiksecka on 3/4/17.
 */
export class CropperModalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
    /**
     * added context to this modal dialog
     * @type {CustomModalContext}
     */
    context: CustomModalContext;
    /**
     * name of file
     * @type {string}
     */
    name: string;
    /**
     * stores data of pictures
     * @type {any}
     */
    data2: any;
    /**
     * stores settings for cropper
     * @type {CropperSettings}
     */
    cropperSettings2: CropperSettings;
    /**
     * cropper element width
     * @type {number}
     */
    croppedWidth: number;
    /**
     * cropper element height
     * @type {number}
     */
    croppedHeight: number;
    /**
     * folder for Firebase storage
     * @type {string}
     */
    folder: string = 'users';
    /**
     * instance of toasterService
     * @type {ToasterService}
     */
    toasterService: ToasterService;
    /**
     * instance of cropper
     * @type {ImageCropperComponent}
     */
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    /**
     * constructor of CropperModalComponent
     *
     * @param router - navigation controller for web app
     * @param toasterService - service to display toasts produced from action
     * @param dialog - dialog reference to handle context
     * @param af - AngularFire instance, to handle operations with authentication and authorization
     */
    constructor(toasterService: ToasterService, public router: Router, public dialog: DialogRef<CustomModalContext>, public af: AngularFire) {
        this.context = dialog.context;
        dialog.setCloseGuard(this);
        this.toasterService = toasterService;

        this.name = 'Angular2'
        //Cropper settings 2
        this.cropperSettings2 = new CropperSettings();
        this.cropperSettings2.width = 200;
        this.cropperSettings2.height = 200;
        this.cropperSettings2.keepAspect = false;

        this.cropperSettings2.croppedWidth = 200;
        this.cropperSettings2.croppedHeight = 200;

        this.cropperSettings2.canvasWidth = 500;
        this.cropperSettings2.canvasHeight = 300;

        this.cropperSettings2.minWidth = 100;
        this.cropperSettings2.minHeight = 100;

        this.cropperSettings2.rounded = true;
        this.cropperSettings2.minWithRelativeToResolution = false;

        this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255, 0, 0, 1)';
        this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
        this.cropperSettings2.noFileInput = true;


        let image: HTMLImageElement = new Image();
        image.src = this.context.file_url;
        image.addEventListener('load', (data) => {
            this.cropper.setImage(image);
        });

        this.data2 = {};
    }

    /**
     * function that adds photo to Firebase storage
     */
    addPhoto() {
        // Create a root reference
        let storageRef = firebase.storage().ref();
        let folder = this.folder;
        let path = `/${this.folder}/${this.context.uuid}`;
        let iRef = storageRef.child(path);
        iRef.putString(this.cropper.image.image, 'data_url').then((snapshot) => {
            // console.log('Uploaded a blob or file! Now storing the reference at', `/${this.folder}/images/`);
            this.toasterService.pop({
                type: 'success',
                title: 'Fotka bola',
                body: 'úspešne pridaná.',
                toastContainerId: 1
            });
            this.dialog.close('success');
        });
    }

    /**
     * function that handles height and width of cropped picture
     *
     * @param bounds
     */
    cropped(bounds: Bounds) {
        this.croppedHeight = bounds.bottom - bounds.top;
        this.croppedWidth = bounds.right - bounds.left;
    }

    /**
     * Used to send image to cropper
     * @param $event
     */
    fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            // console.log(image);
            that.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    /**
     * function that closes dialog
     */
    closeDialog() {
        this.toasterService.pop({type: 'error', title: 'Fotka nebola', body: 'uložená.', toastContainerId: 1});
        this.dialog.close('cancel');
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