'use strict';

requirejs.config({
    urlArgs: 'cache=' + new Date().getTime(),

    paths: {
        babelPolyfill: '../../node_modules/babel-polyfill/dist/polyfill',
        approuter: '../approuter',
        dependencyResolverFor: '../dependencyResolverFor'
    },

    callback: function callback() {
        "use strict";

        require(["app"], function (App) {
            angular.bootstrap(document.documentElement, ['WeatherPrediction']);
        });
    }
});