import { Component, Input } from '@angular/core';

@Component({
    selector: 'tab',
    styles: [],
    template: `
    <div [hidden]="!active" class="pane" style="margin-top: 45px">
      <ng-content></ng-content>
    </div>
  `
})

/**
 * component that represents basic Tab structure
 * Created by dominiksecka on 3/4/17.
 */
export class Tab {
    @Input('tabTitle') title: string;
    @Input('iconTitle') icon: string;
    @Input() active = false;
}