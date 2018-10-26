import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from 'angular2-google-maps/core';

/**
 * GeocodingService class.
 * https://developers.google.com/maps/documentation/javascript/
 * Created by dominiksecka on 4/22/17.
 */
@Injectable() export class GeocodingService {

    geocoder: google.maps.Geocoder;

    /**
     * constructor of GeocodingService
     * @param mapsAPILoader - instance of maps API
     */
    constructor(private mapsAPILoader: MapsAPILoader) {
        this.mapsAPILoader.load().then(() => {
            // console.log('google script loaded');
            this.geocoder = new google.maps.Geocoder();
        });
    }

    /**
     * Reverse geocoding by location.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param latLng Location
     * @return An observable of GeocoderResult
     */
    geocode(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[]> {
        return new Observable((observer: Observer<google.maps.GeocoderResult[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ 'location': latLng }, (
                (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();
                    } else {
                        // console.log('Geocoding service: geocoder failed due to: ' + status);
                        observer.error(status);
                    }
                })
            );
        });
    }

    /**
     * Geocoding services.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param address The address to be searched
     * @return An observable of GeocoderResult
     */
    codeAddress(address: string): Observable<google.maps.GeocoderResult[]> {
        return new Observable((observer: Observer<google.maps.GeocoderResult[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ 'address': address }, (
                (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();
                    } else {
                        // console.log('Geocoding service: geocode was not successful for the following reason: ' + status);
                        observer.error(status);
                    }
                })
            );
        });
    }

}