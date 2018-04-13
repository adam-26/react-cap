// Karma configuration

module.exports = function(config) {
    function normalizationBrowserName(browser) {
        return `json/${browser.toLowerCase().split(/[ /-]/)[0]}`;
    }

    config.set({
        // ... normal karma configuration
        basePath: "",

        // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
        browserNoActivityTimeout: 60000,

        client: {
            mocha: {
                bail: true,
                reporter: "html"
            }
        },

        // frameworks to use
        frameworks: ["chai-sinon", "mocha"],

        files: [
            { pattern: 'node_modules/babel-polyfill/browser.js', instrument: false},
            "./test/test.js"
        ],

        preprocessors: {
            // add webpack as preprocessor
            "./test/test.js": ["webpack", "sourcemap"]
        },

        coverageReporter: {
            dir: ".build/coverage",
            includeAllSources: true,
            reporters: [
                {
                    type: "json",
                    subdir: normalizationBrowserName
                },
                {
                    type: "lcov",
                    subdir: "lcov-report"
                },
                {
                    type: "lcovonly",
                    subdir: ".",
                    file: "lcov.info"
                }
            ]
        },

        webpack: {
            devtool: "inline-source-map",
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        // exclude this dirs from coverage
                        exclude: [/node_modules/],
                        loader: "babel-loader"
                    }
                ]
            },
            watch: true
        },

        webpackServer: {
            noInfo: true
        },

        // test results reporter to use
        // possible values: "dots", "progress", "junit", "growl", "coverage"
        reporters: ["coverage", "spec", "junit"],

        // the default configuration
        junitReporter: {
            outputDir: "./.build/test",
            outputFile: "test-results.xml",
            useBrowserName: false
            // suite: '', // suite will become the package name attribute in xml testsuite element
            // useBrowserName: true, // add browser name to report and classes names
            // nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            // classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            // properties: {} // key value pair of properties to add to the <properties> section of the report
            // xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: process.env.CIRCLECI
            ? ["Chrome", "PhantomJS"]
            : ["Chrome", "PhantomJS", "Firefox"],

        customLaunchers: {
            ChromeTravis: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        },

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
