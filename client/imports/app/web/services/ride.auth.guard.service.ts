/**
 * Created by dominiksecka on 4/30/17.
 */
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AngularFireAuth } from "angularfire2";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {MeteorObservable} from "meteor-rxjs";
import * as firebase from "firebase";

@Injectable() export class RideAuthGuardService implements CanActivate{
    /**
     * authorization state
     * @type {boolean}
     */
    authorized: boolean = false;

    /**
     * constructor of RideAuthGuardService
     *
     * @param auth - authorization service instance
     * @param router - navigation controller for web app
     */
    constructor(public auth: AngularFireAuth, private router: Router) {}

    /**
     * function that determines which ride route should be activated by user, who is logged in
     *
     * @param route
     * @param state
     * @return {Observable<boolean>}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
         return Observable.from(this.auth)
            .take(1)
            .map(state => !!state)
            .do(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/intro']);
                }else{
                    if(!this.authorized) {
                        this.router.navigate(['/authorization']);
                    }
                    MeteorObservable.call("checkDriverExists", firebase.auth().currentUser.uid).subscribe((response) => {
                        // Handle success and response from server!
                        if (response['isDriver'] === true) {
                            MeteorObservable.call("checkRideBelongsToDriver", firebase.auth().currentUser.uid, route.params['id']).subscribe((response) => {
                                // Handle success and response from server!
                                if(response) {
                                    if (response['rideBelongs'] === false) {
                                        this.router.navigate(['/statistics/' + firebase.auth().currentUser.uid + '/driver'], {replaceUrl: true});
                                        this.authorized = true;
                                    } else {
                                        if(!this.authorized){
                                            this.router.navigate(['/' + route.url[0].path + '/' + route.params['id']], {replaceUrl: true});
                                        }
                                        this.authorized = true;
                                    }
                                }
                            }, (err) => {
                                // Handle error
                                // console.log(err);
                            });
                        } else if (response['isDriver'] === false){
                            if(!this.authorized){
                                this.router.navigate(['/' + route.url[0].path + '/' + route.params['id']], {replaceUrl: true});
                            }
                            this.authorized = true;
                        }
                    }, (err) => {
                        // Handle error
                        //console.log(err);
                    });
                }
            })
    }
}