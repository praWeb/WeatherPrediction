'use strict';

requirejs.config({
    urlArgs: 'cache=' + new Date().getTime(),
    config: {
        moment: {
            noGlobal: true
        }
    },
    paths: {
        babelPolyfill: '../../node_modules/babel-polyfill/dist/polyfill',
        approuter: '../approuter',
        dependencyResolverFor: '../dependencyResolverFor',
        moment: '../../node_modules/moment/min/moment-with-locales',
        momentTimezone: '../../node_modules/moment-timezone/builds/moment-timezone-with-data',
        momentUtil: '../../node_modules/moment-timezone/moment-timezone-utils'
    },

    callback: function callback() {
        "use strict";

        require(["app"], function (App) {
            angular.bootstrap(document.documentElement, ['WeatherPrediction']);
        });
    }
});