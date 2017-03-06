module.exports = DrawUtil;

function DrawUtil(clc, printers, shell, numOfLines) {
    'use strict';

    var self = {},
        write = printers.write,
        width = shell.getWidth() * 0.75 | 0,
        maxHeight = shell.getHeight() - 1;

    self.numberOfLines = Math.max(4, Math.min(numOfLines, maxHeight));
    self.nyanCatWidth = 11;
    self.scoreboardWidth = 5;
    self.tick = 0;
    self.trajectories = [];

    for (var i = 0; i < self.numberOfLines; i++) {
        self.trajectories[i] = [];
    }

    self.trajectoryWidthMax = (width - self.nyanCatWidth);

    self.appendRainbow = function(rainbowifier) {
        var segment = self.tick ? '_' : '-';
        var rainbowified = rainbowifier.rainbowify(segment);

        for (var index = 0; index < self.numberOfLines; index++) {
            var trajectory = self.trajectories[index];
            if (trajectory.length >= self.trajectoryWidthMax) {
                trajectory.shift();
            }
            trajectory.push(rainbowified);
        }
    };

    self.drawScoreboard = function(stats) {
        write(' ' + clc.cyan(stats.total) + '\n');
        write(' ' + clc.green(stats.success) + '\n');
        write(' ' + clc.red(stats.failed) + '\n');
        write(' ' + clc.yellow(stats.skipped) + '\n');

        self.fillWithNewlines(5);
        self.cursorUp(self.numberOfLines);
    };

    self.drawRainbow = function() {
        self.trajectories.forEach(function(line) {
            write('\u001b[' + self.scoreboardWidth + 'C');
            write(line.join(''));
            write('\n');
        });

        self.cursorUp(self.numberOfLines);
    };

    self.drawNyanCat = function(stats) {
        var startWidth = self.scoreboardWidth + self.trajectories[0].length;
        var color = '\u001b[' + startWidth + 'C';
        var padding = '';

        write(color);
        write('_,------,');
        write('\n');

        write(color);
        padding = self.tick ? '  ' : '   ';
        write('_|' + padding + '/\\_/\\ ');
        write('\n');

        write(color);
        padding = self.tick ? '_' : '__';
        var tail = self.tick ? '~' : '^';
        write(tail + '|' + padding + self.face(stats) + ' ');
        write('\n');

        write(color);
        padding = self.tick ? ' ' : '  ';
        write(padding + '  ""  "" ');
        write('\n');

        self.fillWithNewlines(5);
        self.cursorUp(self.numberOfLines);
    };

    self.face = function(stats) {
        if (stats.failed) {
            return '( x .x)';
        } else if (stats.skipped) {
            return '( o .o)';
        } else if (stats.success) {
            return '( ^ .^)';
        } else {
            return '( - .-)';
        }
    };

    self.cursorUp = function(n) {
        write(clc.up(n));
    };

    self.fillWithNewlines = function(startFrom) {
        var i = startFrom ? startFrom : 0;

        for (; i < self.numberOfLines + 1; i++) {
            write('\n');
        }
    };

    return self;
}
