import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
    selector: 'stars',
    styles: [`
        .stars {
            display: inline-block;
            position: relative;
            z-index: 0;
        }
        .stars-selected {
            position: absolute;
            max-width: 100%;
            height: 100%;
            z-index: -1;
        }
    `],
    template: `
        <div class="stars"
             [ngStyle]="{'background-color': starBackColor}"
             (click)="secureNewRating()"
             (mouseleave)="leaveRating()"
             (mousemove)="changeRating($event)">
            <div class="stars-selected"
                 [ngStyle]="{'width': selectedWidth, 'background-color': selectedColor}"></div>
            <star-item *ngFor="let i of itemsIterable" [type]="type" [backColor]="backColor" [radius]="radius"></star-item>
        </div>
    `
})

/**
 * component that represents rating visualization
 * @implements {OnInit}
 * Created by dominiksecka on 4/9/17.
 */
export class StarComponent implements OnInit {
    /**
     * element attribute that specifies radius of element
     * @type {number}
     */
    @Input('radius') radius: number;
    /**
     * elemene attribute that specifies type of input
     * @type {string}
     */
    @Input('type') type: string;
    /**
     * element attribute that specifies count of items
     * @type {number}
     */
    @Input('items') items: number;
    /**
     * element attribute that specifies selection color
     * @type {string}
     */
    @Input('sel-color') selectedColor: string;
    /**
     * element attribute that specifies background color
     * @type {string}
     */
    @Input('back-color') backColor: string;
    /**
     * element attribute that specifies stars color
     * @type {string}
     */
    @Input('star-back-color') starBackColor: string;
    /**
     * element attribute that specifies percentage value for rating
     * @type {string}
     */
    @Input('percent') percent: string;
    /**
     * element attribute that specifies count of selected stars
     * @type {number}
     */
    @Input('stars-selected') starsSelected: number;
    /**
     * element attribute for enabling and disabling event handling
     * @type {boolean}
     */
    @Input('disabled') disabled: boolean;
    /**
     * stores secured width
     * @type {string}
     */
    securedWidth: string;
    /**
     * stores selected width
     * @type {string}
     */
    selectedWidth: string;
    /**
     * stores iterable items
     * @type {Array<number>}
     */
    itemsIterable: number[];
    /**
     * stores element dimensions
     * @type {ClientRect}
     */
    elDimensions: ClientRect;
    /**
     * stores element reference
     * @type {ElementRef}
     */
    el: ElementRef;
    /**
     * stores native html element
     * @type {HTMLElement}
     */
    nativeEl: HTMLElement;

    /**
     * constructor of StarComponent
     *
     * @param el - element reference
     */
    constructor(el: ElementRef) {
        this.nativeEl = el.nativeElement;
        this.el = el;
    }

    /**
     * initialization of rating component
     */
    ngOnInit() {
        const getAttr = (nEl: HTMLElement, attr: string, def?: string) :string => nEl.getAttribute(attr) || def;

        // Pass attributes into app
        this.selectedColor = this.selectedColor || getAttr(this.nativeEl, 'sel-color', 'gold');
        this.backColor = this.backColor || getAttr(this.nativeEl, 'back-color', 'white');
        this.starBackColor = this.starBackColor || getAttr(this.nativeEl, 'star-back-color', 'lightgray');
        this.radius = this.radius || parseInt(getAttr(this.nativeEl, 'radius', '30'), 10);
        this.items = this.items || parseInt(getAttr(this.nativeEl, 'items', '5'), 10);
        this.percent = this.percent || getAttr(this.nativeEl, 'percent', '0') + '%';
        this.starsSelected = this.starsSelected || parseFloat(getAttr(this.nativeEl, 'stars-selected', '0'));
        this.disabled = this.disabled || !!getAttr(this.nativeEl, 'disabled');
        this.type = this.type || getAttr(this.nativeEl, 'type', 'star');

        this.itemsIterable = new Array(this.items);
        this.securedWidth = this.starsSelected ? 100 / this.items * this.starsSelected + '%' : this.percent;
        this.elDimensions = this.nativeEl.getBoundingClientRect();

        // initial rating setup
        this.selectedWidth = this.securedWidth;
    }

    /**
     * function that handles mouse event
     * @param e - mouse event
     */
    changeRating(e: MouseEvent) {
        this.selectedWidth = !this.disabled && e.clientX - this.elDimensions.left + 'px';
        this.percent = parseInt(this.selectedWidth, 10) / this.radius * 2 * this.items + '%';
    }

    /**
     * function that leave rating
     */
    leaveRating() {
        this.selectedWidth = this.securedWidth;
    }

    /**
     * function that secures new rating
     */
    secureNewRating() {
        this.securedWidth = this.percent;
    }
}