module.exports = Reporter;

function Reporter (
    commandFactory,
    stats,
    debugLogs,
    shell,
    printers,
    drawUtil,
    rainbowifier,
    Failures,
    options,
    callback
) {
    'use strict';

    var command = commandFactory.run(),
        write = printers.write,
        firstPass = true,
        inResults = false,
        inCompilationFailure = false,
        failures = [],
        timeElapsed;

    command.stdout.on('data', function(data) {
        var str = data.toString(),
            currentStats,
            i;

        if (firstPass) {
            onFirstPass();
        }

        inResults = inResults || str.indexOf('Results') > -1;

        if (str.indexOf('Scanning for projects...') > -1) {
            // This is the start of new tests, maybe there are
            // multiple projects
            inResults = false;
        }

        if (inResults) {
            if (has(str, options.statsMatchers || ['Tests run:'])) {
                stats.finalizeStats(makeCurrentStats(str));
                draw();
            } else if (str.indexOf('Total time') > -1) {
                timeElapsed = str.split(':');
                timeElapsed.shift();        // remove the first part ([INFO] Total time:)
                timeElapsed = timeElapsed
                    .join(':')              // rejoin the rest of it (01:26 min)
                    .trim();                // get rid of trailing whitespace
            }
        } else {
            if (has(str, options.statsMatchers || ['Tests run:'])) {
                stats.incrementStats(makeCurrentStats(str));
            } else if (has(str, options.errorMatchers || ['<<< FAILURE!', '<<< ERROR!'])) {
                failures = failures.concat(new Failures(str));
            } else if (has(str, options.compilationErrorMatchers || ['COMPILATION ERROR'])) {
                inCompilationFailure = true;
            }

            draw();
        }

        if (options.showLogs || inCompilationFailure) {
            if (options.logMatchers.indexOf('*ALL*') > -1 || inCompilationFailure) {
                debugLogs.addLog(str);
            } else {
                for (i = 0; i < options.logMatchers.length; i += 1) {
                    if (str.indexOf(options.logMatchers[i]) > -1) {
                        debugLogs.addLog(str);
                        break; // don't add this line more than once
                    }
                }
            }
        }
    });

    command.on('close', function(code) {
        draw();
        drawUtil.fillWithNewlines();
        printers.printTestFailures(failures);
        printers.printDebugLogs(debugLogs.getLogs());
        printers.printStats(stats, timeElapsed);

        if (options.folders.length) {
            // add a bottom-buffer
            printers.write('\n');
        }

        shell.cursor.show();
        callback();
    });

    function onFirstPass () {
        firstPass = false;
        shell.cursor.hide();
        printers.write('\n');

        if (options.scaredyCat) {
            write('Running tests...');
        }
    }

    function draw () {
        drawUtil.appendRainbow(rainbowifier);

        if (!options.scaredyCat) {
            drawUtil.drawScoreboard(stats);
            drawUtil.drawRainbow();
            drawUtil.drawNyanCat(stats);
        }

        drawUtil.tick = !drawUtil.tick;
    }

    function makeCurrentStats (input) {
        var split = input.split(' '),
            total = parseInt(split[2]),
            failed = parseInt(split[4]),
            error = parseInt(split[6]),
            skipped = parseInt(split[8]);

        return {
            success: total - (failed + error + skipped),
            failed:  (failed + error),
            skipped: skipped,
            total: total
        };
    }

    function has (input, matchers) {
        var i;

        for (i = 0; i < matchers.length; i += 1) {
            if (input.indexOf(matchers[i]) > -1) {
                return true;
            }
        }
    }
}
