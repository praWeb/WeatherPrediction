var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,
  paths:{
    babelPolyfill : 'node_modules/babel-polyfill/dist/polyfill',
    test: '../test',
    angular : 'node_modules/angular/angular',
    app : 'scripts/dest/app',
    angularMock : 'node_modules/angular-mocks/angular-mocks',
    approuter : 'scripts/approuter',
    angularRoute : 'node_modules/angular-route/angular-route',
    moment : 'node_modules/moment/min/moment.min',
    momentTimezone : 'node_modules/moment-timezone/builds/moment-timezone-with-data'
   // momentUtil : 'node_modules/moment-timezone/moment-timezone-utils'
  },
  shim: {
    angular: { exports: 'angular' },
    angularMock: { deps: ['angular'] },
    approuter : { deps: ['angularRoute']}
  },
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
