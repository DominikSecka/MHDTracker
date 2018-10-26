import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AngularFireAuth} from "angularfire2";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import {Location, PlatformLocation} from "@angular/common";

/**
 * service provides basic functionality of authorization guard
 * @implements {CanActivate}
 * Created by dominiksecka on 4/29/17.
 */
@Injectable()
export class AuthGuardService implements CanActivate {

    /**
     * constructor of AuthGuardService
     *
     * @param auth - authorization service instance
     * @param router - navigation controller for web app
     */
    constructor(public auth: AngularFireAuth, private router: Router) {

    }

    /**
     * function that determines which basic routers should be activated for not logged in users
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
                }
            })
    }

}