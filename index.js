'use strict';

// Dependencies
const Page = require('page.js');
const Events = require('events');

module.exports = (config) => {
    let self = new Events();

    if (!config || !config.routes) {
        throw new Error('Invalid config object');
    }

    Page({
        popstate: true
    });

    Object.keys(config.routes).forEach(path => {
        Page(path, (context) => {
            self.emit('pageChanged', {
                name: config.routes[path],
                context: context
            });
        });
    });

    Page('*', ctx => {
        console.log('not found');
    });

    if (config.initialDispatch) {
        Page.redirect(document.location.pathname);
    }

    // exported methods
    self.page = page;

    return self;
};

function page (url) {
    Page(url);
}