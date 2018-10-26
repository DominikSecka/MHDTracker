import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import template from "./header-dispecing.component.web.html";
import style from "./header-dispecing.component.web.scss";
import {Modal, overlayConfigFactory} from "angular2-modal";
import {SettingsModalComponent} from "../settingsModal/settings.modal.component.web";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {AngularFireAuth} from "angularfire2";
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {Dispatchers} from "../../../../../both/collections/dispatchers.collection";
import {Dispatcher} from "../../../../../both/models/dispatcher.model";

@Component({
    selector: 'header-dispecing',
    template,
    styleUrls: [style]
})

/**
 * component that provides header for main dispatching part of application
 * @implements {OnInit, OnDestroy}
 * Created by dominiksecka on 3/4/17.
 */
export class DispecingHeaderComponent implements OnInit, OnDestroy {
    /**
     * stores the name of dispatcher
     * @type {string}
     */
    name: string;
    /**
     * stores uid of dispatcher
     * @type {string}
     */
    uid: string;
    /**
     * stores dispatchers profile picture download url
     * @type {string}
     */
    pictureUrl: string;
    /**
     * dispatcher subscription for Meteor dispatchers publication
     * @type {Subscription}
     */
    dispatcherSub: Subscription;
    /**
     * Observable cursor of dispatchers collection
     */
    dispatchers: Observable<Dispatcher[]>;

    /**
     * constructor of DispecingHeaderComponent
     *
     * @param modal - modal dialog handler
     * @param auth - authorization service of Firebase
     */
    constructor(public modal: Modal, public auth: AngularFireAuth) {

    }

    /**
     * function that handles navigation request to SettingsModalComponent
     * @returns {Promise<DialogRef<any>>}
     */
    settingsClicked() {
        return this.modal.open(SettingsModalComponent, overlayConfigFactory({
            id: 'id',
            unlocked: false
        }, BSModalContext));
    }

    /**
     * function that unsubscribe subscriptions in this modal dialog
     */
    ngOnDestroy(): void {
        if (this.dispatcherSub) {
            this.dispatcherSub.unsubscribe();
        }
    }

    /**
     * function that initialize all subscriptions on initialization of component
     */
    ngOnInit(): void {
        Observable.from(this.auth)
            .take(1).subscribe(response => {
            this.uid = response.uid;
        });

        this.dispatcherSub = MeteorObservable.subscribe('dispatchers').subscribe(() => {
            this.dispatchers = Dispatchers.find({id: this.uid}).zone();
            this.dispatchers.subscribe((data) => {
                this.name = data[0].name;
                this.pictureUrl = data[0].pictureUrl;
            })
        });
    }
}