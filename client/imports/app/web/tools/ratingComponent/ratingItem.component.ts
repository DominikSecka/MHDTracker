import {Component, ElementRef} from '@angular/core';

@Component({
    selector: 'star-item',
    inputs: ['radius', 'type', 'backColor'],
    styles: [`
        canvas.star {
            float: left;
            z-index: 1;
        }
    `],
    template: `
        <canvas
                class="star"
                height="{{ radius*2 }}"
                width="{{ radius*2 }}"></canvas>`
})

/**
 * component of item for parent StarComponent
 * Created by dominiksecka on 4/9/17.
 */
export class StarItemComponent {
    /**
     * stores value of radius
     * @type {number}
     */
    radius: number;
    /**
     * stores reference to parent element
     * @type {ElementRef}
     */
    root: ElementRef;
    /**
     * stores information about color of item
     * @type {string}
     */
    backColor: string;
    /**
     * stores type of item
     * @type {string}
     */
    type: string;

    /**
     * constructor of StaritemComponent
     * @param myElement - custom pecific element reference
     */
    constructor(myElement: ElementRef) {
        this.root = myElement;
    }

    // Entry point for item drawing
    /**
     * fucntion that represents entry point for item drawing
     *
     * @param type - specifies type of item
     * @param ctx - context of 2D rendering
     * @param r - radius
     * @return {undefined}
     */
    drawItem(type: string, ctx: CanvasRenderingContext2D, r: number) {
        return typeof this[type] === 'function' ? this[type](ctx, r) : this.star(ctx, r);
    }

    // Draw star image
    /**
     * function that draws star
     *
     * @param ctx - context of 2D rendering
     * @param r - radius
     */
    star(ctx: CanvasRenderingContext2D, r: number) {
        if (!ctx) throw Error('No Canvas context found!');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';

        ctx.beginPath();
        ctx.translate(r, r);
        ctx.moveTo(0, 0 - r);
        for (var i = 0; i < 5; i++) {
            ctx.rotate(Math.PI / 5);
            ctx.lineTo(0, 0 - (r * 0.5));
            ctx.rotate(Math.PI / 5);
            ctx.lineTo(0, 0 - r);
        }
        ctx.fill();
        ctx.restore();
    }

    // Draw circle image
    /**
     * function that draws circle
     *
     * @param ctx - context of 2D rendering
     * @param r - radius
     */
    circle(ctx: CanvasRenderingContext2D, r: number) {
        if (!ctx) throw Error('No Canvas context found!');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(r, r, r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();
    }

    // Draw main canvas area
    /**
     * function that draws rectangle
     *
     * @param ctx - context of 2D rendering
     * @param dim - dim of this component
     * @param backColor - background color
     */
    drawRect(ctx: CanvasRenderingContext2D, dim: number, backColor: string) {
        if (!ctx) throw Error('No Canvas context found!');
        ctx.save();
        ctx.fillStyle = backColor;
        ctx.fillRect(0, 0, dim, dim);
        ctx.restore();
    }

    // Hook: draw canvas image on the template rendered
    /**
     * function that initializes rating item component
     */
    ngOnInit() {
        setTimeout(() => {
            const el: HTMLCanvasElement = this.root.nativeElement.querySelector('.star');
            const ctx: CanvasRenderingContext2D = el.getContext("2d");

            this.drawRect(ctx, this.radius * 2, this.backColor);
            this.drawItem(this.type,  ctx, this.radius);
        });
    }
}