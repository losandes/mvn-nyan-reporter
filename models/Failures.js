module.exports = Failures;

function Failures (input) {
    'use strict';

    var lines = input.split('\n'),
        currentFailure,
        failures = [];

    lines.forEach(function (line) {
        if (line.indexOf('<<< FAILURE!') > -1 || line.indexOf('<<< ERROR!') > -1) {
            if (currentFailure) {
                failures.push(currentFailure);
            }

            currentFailure = [];
        }

        if (!currentFailure) {
            currentFailure = [];
        }

        currentFailure.push(line);
    });

    // push the last failure onto the stack
    failures.push(currentFailure);

    return failures
        .map(function (arr) {
            var failure = {
                    test: arr.shift(),              // 1st line is the test name
                    comparison: arr.shift(),        // at least the 2nd line is the comparison
                    stack: arr.join('\n') + '\n'    // the rest is the stack
                },
                tmp;

            if (
                failure.comparison.indexOf('expected') > -1 &&
                failure.comparison.indexOf('but was') > -1
            ) {
                tmp = failure.comparison.split('expected:')[1];
                failure.expected = tmp.substring(1, tmp.indexOf('>'));
                tmp = tmp.split('but was:')[1];
                failure.actual = tmp.substring(1, tmp.indexOf('>'));
            } else {
                failure.comparison += '\n';
            }

            return failure;
        });
}
