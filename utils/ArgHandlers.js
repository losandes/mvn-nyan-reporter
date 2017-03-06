module.exports = ArgHandlers;

var passThru = ['-Dtest'],
    fonts = ['none', 'subzero', 'isometric', 'small-isometric', '3D-ascii'];

function ArgHandlers () {
    var args = ['test'],
        options = {
            logMatchers: [],                // ['DEBUG', 'INFO', 'WARN', 'ERROR', 'something_im_looking_for'],
            folders: [],
            font: 'subzero',
            showDirectoryHeading: true,
            statsHeading: false,
            failuresHeading: false,
            logsHeading: true,
            statsMatchers: null,            // ['Tests run:'] TODO: support overrides
            errorMatchers: null,            // ['<<< FAILURE!', '<<< ERROR!'] TODO: support overrides
            compilationErrorMatchers: null, // ['COMPILATION ERROR'] TODO: support overrides
            showLogs: false,
            scaredyCat: false,
            parallel: false,
            writer: null                    // TODO: add switches to support other writers, like file writers
        },
        self = {
            handlers: [],
            getMvnArgs: function () {
                return args;
            },
            getOptions: function () {
                return options;
            }
        };

    // MVN Surefire passthru - any known arg that is written the same
    // way you would write it when using `mvn test` is added to the mvn args
    // -Dtest=SomeTestClass
    // -Dtest=SomeTestClass#someTestMethod
    self.handlers.push({
        matches: function (i) {
            return process.argv[i].indexOf('=') > -1 &&
                passThru.indexOf(process.argv[i].split('=')[0]) > -1;
        },
        execute: function (i) {
            args.push(process.argv[i]);
        }
    });

    // Short hand for specifying which test you want to run
    // -t SomeTestClass
    // -t SomeTestClass#someTestMethod
    // -t SomeTestClass,OtherTestClass
    // -tests SomeTestClass
    // -tests SomeTestClass#someTestMethod
    // -tests SomeTestClass,OtherTestClass
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-tests') || argvMatches(i, '-t');
        },
        execute: function (i) {
            args.push('-Dtest=' + process.argv[i + 1]);
        }
    });

    // Print logs after running, with optional filtering
    // -l true (prints all logs)
    // -l DEBUG (print all logs that have the word DEBUG in them)
    // -logs true (prints all logs)
    // -logs DEBUG (print all logs that have the word DEBUG in them)
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-logs') || argvMatches(i, '-l');
        },
        execute: function (i) {
            if (argvMatches(i + 1, 'true')) {
                options.logMatchers.push('*ALL*');
                options.showLogs = true;
            } else {
                options.logMatchers = options.logMatchers.concat(
                    process.argv[i + 1]
                        .split(',')
                        .map(function (item) {
                            return item.trim();
                        })
                );

                options.showLogs = true;
            }

        }
    });

    // Set the working directories
    // -f ./common
    // -f ./common,./my-project
    // -folders ./common
    // -folders ./common,./my-project
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-folders') || argvMatches(i, '-f');
        },
        execute: function (i) {
            options.folders = process.argv[i + 1]
                .split(',')
                .map(function (item) {
                    return item.trim();
                });
        }
    });

    // Hide the cat that runs across the screen
    // -scaredyCat true
    self.handlers.push({
        matches: function (i) {
            return (argvMatches(i, '-scaredycat') &&
                    argvMatches(i + 1, 'true')) ||
                    argvMatches(i, '--scaredycat');
        },
        execute: function (i) {
            options.scaredyCat = true;
        }
    });

    // Run the tests in each directory, in parallel
    self.handlers.push({
        matches: function (i) {
            return (argvMatches(i, '-parallel') &&
                    argvMatches(i + 1, 'true')) ||
                    argvMatches(i, '--parallel');
        },
        execute: function (i) {
            options.parallel = true;
            options.showDirectoryHeading = false;
        }
    });

    // Choose the heading font
    // -font subzero
    // -font none
    // -font isometric
    // -font small-isometric
    // -font 3D-ascii
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-font');
        },
        execute: function (i) {
            if (fonts.indexOf(process.argv[i + 1]) > -1) {
                options.font = process.argv[i + 1];
            }
        }
    });

    // Set the stats heading
    // -statsHeading true
    // -statsHeading Outcome
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-statsHeading');
        },
        execute: function (i) {
            if (options.statsHeading === 'true') {
                options.statsHeading = 'Stats';
            } else {
                options.statsHeading = process.argv[i + 1];
            }
        }
    });

    // Set the stats heading
    // -failuresHeading true
    // -failuresHeading ERR
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-failuresHeading');
        },
        execute: function (i) {
            if (options.failuresHeading === 'true') {
                options.failuresHeading = 'Failures';
            } else {
                options.failuresHeading = process.argv[i + 1];
            }
        }
    });

    // Set the logs heading (default: Logs)
    // -logsHeading false
    // -logsHeading Output
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-logsHeading');
        },
        execute: function (i) {
            if (argvMatches(i + 1, 'false')) {
                options.logsHeading = false;
            } else {
                options.logsHeading = process.argv[i + 1];
            }

        }
    });

    // Set the logs heading (default: Logs)
    // -dirHeading false
    self.handlers.push({
        matches: function (i) {
            return argvMatches(i, '-dirHeading') &&
                argvMatches(i + 1, 'false');
        },
        execute: function (i) {
            options.logsHeading = false;
        }
    });

    return self;
}

function argvMatches (i, swich) {
    return process.argv[i].toLowerCase() === swich.toLowerCase();
}
