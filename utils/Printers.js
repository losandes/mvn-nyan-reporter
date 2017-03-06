module.exports = Printers;

function Printers (clc, rainbowifier, writerFactory, fonts, options) {
    var self = {
            write: write,
            printTestFailures: printTestFailures,
            printDebugLogs: printDebugLogs,
            printStats: printStats,
            printHeading: printHeading
        },
        rainbowify = rainbowifier.rainbowify;

     /*
     // Write a line of output (default is process.stdout.write)
     */
    function write (string) {
        'use strict';
        writerFactory.get().write(string);
    }

    /*
    // Print the failures and errors
    */
    function printTestFailures (failures) {
        'use strict';

        if (failures.length && options.failuresHeading) {
            printHeading(options.failuresHeading);
        }

        failures.forEach(function (failure) {
            write(clc.red(failure.test + '\n'));
            write(clc.cyan(failure.comparison + '\n'));

            if (failure.expected && failure.actual) {
                write('\n  Expected: ' + clc.green(failure.expected));
                write('\n  Actual:   ' + clc.red(failure.actual + '\n\n'));
            } else if (failure.expected) {
                write('\n  Expected: ' + clc.red(failure.expected) + '\n\n');
            } else if (failure.actual) {
                write('\n  Actual: ' + clc.red(failure.actual + '\n\n'));
            }

            if (failure.stack) {
                write(failure.stack);
            }
        });

        if (failures.length) {
            write('\n');
        }
    }

    /*
    // Print the final outcomes
    */
    function printStats (stats, timeElapsed) {
        'use strict';
        var inc = 3;

        if (options.statsHeading) {
            printHeading(options.statsHeading);
            write('\n');
        }

        write(clc.right(inc + 2));
        write(clc.cyan(stats.total + ' total'));

        write(clc.right(inc));
        write(clc.green(stats.success + ' passed'));

        write(clc.right(inc));
        write(clc.red(stats.failed + ' failed'));

        write(clc.right(inc));
        write(clc.yellow(stats.skipped + ' skipped'));

        if (timeElapsed) {
            write(clc.right(inc));
            write(clc.cyan('(' + timeElapsed + ')'));
        }

        write('\n');
        write('\n');
    }

    /*
    // Print any logs that match the "logMatchers" arguments
    */
    function printDebugLogs (logs) {
        'use strict';

        if (!logs || !logs.length) {
            return;
        }

        if (options.logsHeading) {
            write('\n');
            write('\n');
            printHeading('Logs');
        }

        write('\n');
        write('\n');

        logs.forEach(function (msg) {
            write(msg);
        });

        write('\n');
    }

    function printHeading (word) {
        var headings = [];

        if (options.font === 'none') {
            headings.push(makeNoFontHeading(word));
        } else {
            headings = fonts.makeWord({
                font: options.font,
                word: word,
                indent: 3
            });
        }

        headings.forEach(function (line) {
            rainbowifier.reset();
            line.forEach(function (char) {
                write(rainbowify(char));
            });
        });
    }

    function makeNoFontHeading (word) {
        var heading = ['#','#','#','#','#','#','#',' '],
            i;

        for (i = 0; i < word.length; i += 1) {
            heading.push(word[i]);
        }

        heading = heading.concat([' ','#','#','#','#','#','#','#','#']);
        return heading;
    }

    return self;
}
