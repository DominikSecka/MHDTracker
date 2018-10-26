import {Component, ContentChildren, QueryList, AfterContentInit, OnDestroy} from '@angular/core';
import {Tab} from './tab';

import template from './tabs.component.web.html'

@Component({
    selector: 'tabs',
    template
})

/**
 * component that represents parent for tabs
 * @implements {AfterContentInit}
 * Created by dominiksecka on 3/4/17.
 */
export class Tabs implements AfterContentInit {

    @ContentChildren(Tab) tabs: QueryList<Tab>;

    /**
     * function that activates tabs after content init
     */
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        let lastSelectedTabs = [];
        if (JSON.parse(localStorage.getItem('currentTab')) != null) {
            lastSelectedTabs = this.tabs.filter((tab) => tab.title == JSON.parse(localStorage.getItem('currentTab')).title);
        }

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            if (lastSelectedTabs.length !== 0) {
                this.selectTab(lastSelectedTabs[0]);
            } else {
                this.selectTab(this.tabs.first);
            }
        }
    }

    /**
     * function that selects specified tab
     *
     * @param tab - instance of tab that should be activated
     */
    selectTab(tab: Tab) {

        localStorage.setItem('currentTab', JSON.stringify({title: tab.title}));
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;
    }

}