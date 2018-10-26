import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AngularFireAuth} from "angularfire2";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import {MeteorObservable} from "meteor-rxjs";
import * as firebase from "firebase";
import {Location} from "@angular/common";

/**
 * service that provides authorization of router that should be visible only for current driver
 * @implements {CanActivate}
 * Created by dominiksecka on 4/29/17.
 */
@Injectable()
export class DriverAuthGuardService implements CanActivate {
    /**
     * stores state of authorization
     * @type {boolean}
     */
    authorized: boolean = false;

    /**
     * constructor of DriverAuthGuardService
     *
     * @param auth - authorization service instance
     * @param router - navigation controller for web app
     */
    constructor(public auth: AngularFireAuth, private router: Router) {
    }

    /**
     * function that determines which route should be activated by driver, who is logged in
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
                } else {
                    if (!this.authorized) {
                        this.router.navigate(['/authorization']);
                    }
                    MeteorObservable.call("checkDriverExists", firebase.auth().currentUser.uid).subscribe((response) => {
                        // Handle success and response from server!
                        if (response['isDriver'] === true) {
                            this.router.navigate(['/statistics/' + firebase.auth().currentUser.uid + '/driver'], {replaceUrl: true});
                            this.authorized = true;
                        } else if (response['isDriver'] === false) {
                            if (!this.authorized) {
                                this.router.navigate(['/statistics/' + route.params['id'] + '/dispatcher'], {replaceUrl: true});
                            }
                            this.authorized = true;
                        }
                    }, (err) => {
                        // Handle error
                        // console.log(err);
                    });
                }
            })
    }

}