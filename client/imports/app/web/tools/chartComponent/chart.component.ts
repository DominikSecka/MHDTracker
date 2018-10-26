import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from "@angular/core";
import 'highcharts/adapters/standalone-framework.src';
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from 'rxjs/Subscription';
import {Counts} from "meteor/tmeasday:publish-counts";
import {Waypoints} from "../../../../../../both/collections/waypoints.collection";
import {Observable} from "rxjs";
import {Waypoint} from "../../../../../../both/models/waypoint.model";
import {DatePipe} from "@angular/common";
import * as HichartsExporting from '../../../../../../node_modules/highcharts/modules/exporting';
import template from "./chart.component.html"

/**
 * constant that links highcharts library to this component
 * @type {any}
 */
const Highcharts = require('highcharts/highcharts.src');

HichartsExporting(Highcharts);
@Component({
    selector: 'chart-mhdtracker',
    template: template,
    providers: [DatePipe]
})

/**
 * component that provides chart fucntionality
 * @implements {AfterViewInit, OnDestroy}
 * Created by dominiksecka on 4/4/17.
 */
export class ChartComponent implements AfterViewInit, OnDestroy {
    /**
     * element attribute of component that specifies identifier of ride
     * @type {string}
     */
    @Input() rideId;
    /**
     * element attribute of component that specifies height of component
     * @type {string}
     */
    @Input() height;
    /**
     * instance of chart elememet
     * @type {ElementRef}
     */
    @ViewChild('chart') public chartEl: ElementRef;
    /**
     * local instance of chart component
     * @type {any}
     */
    private _chart: any;
    /**
     * subscriontion to Meteor waypoints publication
     * @type {Subscription}
     */
    private waypointsSub: Subscription;
    /**
     * count of filtered waypoints for specified ride
     * @type {number}
     */
    private waypoints_count: number;
    /**
     * Observable cursor of waypoints collection
     * @type {Observable<Waypoint[]>}
     */
    private waypoints: Observable<Waypoint[]>;
    /**
     * array of data for chart y axis
     * @type {Array}
     */
    chartData: number[] = [];
    /**
     * array of data for chart x axis
     * @type {Array}
     */
    times: string[] = [];
    /**
     * options for rendering chart
     * @type {any}
     */
    opts: any;

    /**
     * constructor of ChartComponent
     *
     * @param datePipe - pipe for transforming dates
     */
    constructor(private datePipe: DatePipe) {

    }

    /**
     * function that provides initialization of subscriptions and chart options after view init
     */
    ngAfterViewInit(): void {
        console.log(this.rideId);

        this.waypointsSub = MeteorObservable.subscribe('waypoints', this.rideId).subscribe(() => {
            this.waypoints_count = Counts.get('numberOfWaipoints');
            console.log(this.waypoints_count, 'here');
            this.waypoints = Waypoints.find({ride_id: this.rideId}, {fields: {timestamp: 1, rating: 1}}).zone();
            this.waypoints.forEach((waypoint) => {
                if (waypoint.length === this.waypoints_count) {
                    waypoint.forEach((v) => {
                        this.chartData.push(v.rating);
                        this.times.push(this.datePipe.transform(v.timestamp - 3600000, "HH:mm:ss"));
                    });
                    this.renderChart();
                } else if (this.waypoints_count < waypoint.length) {
                    console.log('push');
                    this.times.push(this.datePipe.transform(waypoint[waypoint.length - 1].timestamp - 3600000, "HH:mm:ss"));
                    this._chart['series'][0].addPoint(waypoint[waypoint.length - 1].rating, true, true);
                }
            })
        });


        this.opts = {
            title: {
                text: 'Hodnotenie jazdy'
            },
            xAxis: {
                categories: this.times,
                title: {
                    text: 'čas'
                }
            },
            yAxis: {
                title: {
                    text: 'Rating'
                },
                max: 100,
                labels: {
                    formatter: function () {
                        return this.value + "%";
                    }
                },
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Hodnotenie komfortu jazdy: <b>{point.y:,.0f}%</b>'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    pointStart: 0,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops:
                        [
                            /*[0, '#a83e3e'],
                             [0.21, '#d34e47'],
                             [0.40, '#edbb5a'],
                             [0.57, '#e2e57a'],
                             [0.76, '#8dcc63'],
                             [1, '#7ab237']*/
                            [0, '#7ab237'],
                            [0.21, '#8dcc63'],
                            [0.40, '#e2e57a'],
                            [0.57, '#edbb5a'],
                            [0.76, '#d34e47'],
                            [1, '#a83e3e']
                        ]
                },
                lineWidth: 2,
                marker:{
                    enabled: true,
                    fillColor: '#7ab237',
                },
                type: 'spline',
                data: this.chartData,
                backgroundColor: 'transparent',
                plotShadow : false
            }]
        };


    }

    /**
     * function that renders chart with initialized options
     */
    renderChart() {
        if (this.chartEl && this.chartEl.nativeElement) {
            console.log('chart init');
            this.opts.chart = {
                type: 'spline',
                height: this.height,
                zoomType: 'x',
                renderTo: this.chartEl.nativeElement
            };

            this._chart = new Highcharts.Chart(this.opts);
        }

    }

    /**
     * function that removes subscriptions and chart on component destroy
     */
    ngOnDestroy(): void {
        if (this._chart) {
            this._chart.destroy();
        }
        if (this.waypointsSub) {
            this.waypointsSub.unsubscribe();
        }
        this.chartData = null;
    }
}