var webpackConfig = require('./webpack.config.js');
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // 'test/**/*.js',
      // 'spec/**/*.[sS]pec.js',
      // 'dist/*.js',
      //'src/**/*.ts',
      //'src/**/*.js',
     'spec/**/*.[sS]pec.js',
    ],
    exclude: ['node_modules'],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "es6"
      },
      tsconfig: "./tsconfig.json",
    },
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //'src/**/*.ts': ['webpack'],
      //'src/**/*.js': ['webpack', 'coverage'],
      'spec/**/*.[sS]pec.js': ['webpack'],
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['kjhtml', 'karma-typescript'],
    plugins: [
      'karma-typescript',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-coverage',
      'karma-jasmine-html-reporter'
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,
    notifyReporter: {
      reportEachFailure: true, // Default: false, will notify on every failed sepc
      reportSuccess: true // Default: true, will notify when a suite was successful
  },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    webpack: {
      mode: 'development',
      resolve: webpackConfig.resolve,
      module: webpackConfig.module
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
  })
}