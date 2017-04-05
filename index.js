'use strict';

// Dependencies
const Page = require('page.js');
const Events = require('events');

module.exports = (config) => {
    let self = new Events();

    if (!config || !config.routes) {
        throw new Error('Invalid config object');
    }

    // set page.js options
    config.options = config.options || {};
    Page(config.options);

    Object.keys(config.routes).forEach(path => {
        Page(path, (context) => {
            self.emit('pageChanged', {
                name: config.routes[path],
                context: context
            });
        });
    });

    // not found
    Page('*', ctx => {

        if (config.notFound) {
            self.emit('pageChanged', {
                name: config.notFound,
                context: {}
            });
        }
    });

    if (config.initialDispatch) {
        Page.redirect(document.location.pathname);
    }

    // exported methods
    self.page = page;

    return self;
};

function page (url) {

    if (typeof url !== 'string') {
        return;
    }

    Page(url);
}