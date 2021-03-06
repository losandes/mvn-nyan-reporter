#!/usr/bin/env node

var async = require('async'),
    clc = require('cli-color'),
    ArgHandlers = require('./utils/ArgHandlers.js'),
    argHandlers = new ArgHandlers(),
    Fonts = require('./fonts/Fonts.js'),
    fonts = new Fonts(),
    Rainbowifier = require('./utils/Rainbowifier.js'),
    rainbowifier = new Rainbowifier(),
    Failures = require('./models/Failures.js'),
    Printers = require('./utils/printers'),
    printers = new Printers(clc, rainbowifier, makeWriterFactory(), fonts, argHandlers.getOptions()),
    Shell = require('./utils/Shell.js'),
    shell = new Shell(printers),
    DrawUtil = require('./utils/DrawUtil.js'),
    drawUtil = new DrawUtil(clc, printers, shell, 4),
    Stats = require('./models/Stats.js'),
    DebugLogs = require('./models/DebugLogs.js'),
    Reporter = require('./Reporter.js');

// Apply the arguments
process.argv.forEach(function (arg, i) {
    var j;

    for (j = 0; j < argHandlers.handlers.length; j += 1) {
        if (argHandlers.handlers[j].matches(i)) {
            argHandlers.handlers[j].execute(i);
            break;
        }
    }
});

// Create and run the Reporter(s)
start(argHandlers.getOptions().folders);

//////////////////////////////////////
// PRIVATE

function start (folders) {
    var tasks = [];

    function makeTask (dir) {
        return function (callback) {
            // Create and run the Reporter
            new Reporter(
                makeHeading(dir),
                makeCommandFactory(dir),
                new Stats(),
                new DebugLogs(),
                shell,
                printers,
                drawUtil,
                rainbowifier,
                Failures,
                argHandlers.getOptions(),
                callback
            );
        };
    }

    if (folders.length) {
        folders.forEach(function (folder) {
            tasks.push(makeTask(folder));
        });
    } else {
        tasks.push(makeTask());
    }

    if (argHandlers.getOptions().parallel) {
        async.parallel(tasks, function (err) {
            if (err) {
                printers.write(clc.red('######## ABORTED #########'));
            }
        });
    } else {
        async.series(tasks, function (err) {
            if (err) {
                printers.write(clc.red('######## ABORTED #########'));
            }
        });
    }
}

function makeCommandFactory (dir) {
    if (dir) {
        return {
            run: function () {
                return require('child_process')
                    .spawn('mvn', argHandlers.getMvnArgs(), { cwd: dir });
            }
        };
    } else {
        return {
            run: function () {
                return require('child_process')
                    .spawn('mvn', argHandlers.getMvnArgs());
            }
        };
    }
}

function makeHeading (dir) {
    var heading;

    if (!dir) {
        return null;
    }

    heading = dir.split('/');
    return heading[heading.length - 1];
}

function makeWriterFactory () {
    return {
        get: function () {
            // TODO: switch (argHandlers.getOptions().writer)
            return process.stdout;
        }
    };
}
