import { Component } from '@angular/core';

import template from './app.component.web.html';
import {ToasterConfig} from 'angular2-toaster';

@Component({
    selector: 'app',
    template
})

/**
 * main component of web app
 * Created by dominiksecka on 2/15/17.
 */
export class AppWebComponent {
    /**
     * toaster service configuration
     * @type {ToasterConfig}
     */
    public toasterconfig : ToasterConfig =
        new ToasterConfig({
            showCloseButton: false,
            tapToDismiss: false,
            timeout: 5000,
            mouseoverTimerStop: false,
            toastContainerId: 1
        });
}
