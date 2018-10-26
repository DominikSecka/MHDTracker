import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AngularFireAuth} from "angularfire2";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import {MeteorObservable} from "meteor-rxjs";
import * as firebase from "firebase";
import {ToasterService} from "angular2-toaster";

/**
 * service that provides authorization for routes that should be opened only for dispatchers
 * @implements {CanActivate}
 * Created by dominiksecka on 4/29/17.
 */
@Injectable()
export class DispatcherAuthGuardService implements CanActivate {
    /**
     * stores state of authorization
     * @type {boolean}
     */
    authorized: boolean = false;
    /**
     * stores instance of toaster service
     * @type {ToasterService}
     */
    private toasterService: ToasterService;

    /**
     * constructor for DispatcherAuthGuardService
     *
     * @param toasterService - service to display toasts produced from action
     * @param auth - authorization service instance
     * @param router - navigation controller for web app
     */
    constructor(toasterService: ToasterService, public auth: AngularFireAuth, private router: Router) {
        this.toasterService = toasterService;
    }

    /**
     * function that determines which route should be activated by dispatcher, who is logged in
     *
     * @param route - route that should be activated
     * @param state - router state
     * @return {Observable<boolean>}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.from(this.auth)
            .take(1)
            .map(state => !!state)
            .do(authenticated => {
                // console.log("Authenticated: " + authenticated);
                if (!authenticated) {
                    this.router.navigate(['/intro']);
                    this.toasterService.pop({
                        type: 'error',
                        title: '',
                        body: 'Prihláste sa, prosím!',
                        toastContainerId: 1
                    });
                } else {
                    if (!this.authorized) {
                        this.router.navigate(['/authorization']);
                    }
                    MeteorObservable.call("checkDispatcherExists", firebase.auth().currentUser.uid).subscribe((response) => {
                        // Handle success and response from server!
                        if (response) {
                            if (response['isDispatcher'] === false) {
                                this.authorized = true;
                                this.router.navigate(['/statistics/' + firebase.auth().currentUser.uid + '/driver'], {replaceUrl: true})
                            } else if (response['isDispatcher'] === true) {
                                this.authorized = true;
                                this.router.navigate(['/dispatching'], {replaceUrl: true});
                            }
                        }
                    }, (err) => {
                        // Handle error
                        // console.log(err);
                    });
                }
            })
    }

}