module.exports = Rainbowifier;

function Rainbowifier() {
    'use strict';

    var self = {
            rainbowify: rainbowify,
            reset: reset
        },
        colorIndex = 0,
        rainbowColors = generateColors();

    function rainbowify (input) {
        var color = rainbowColors[colorIndex % rainbowColors.length];
        colorIndex += 1;
        return '\u001b[38;5;' + color + 'm' + input + '\u001b[0m';
    }

    function reset () {
        colorIndex = 0;
    }

    return self;
}

/*
// Generate rainbow colors
*/
function generateColors () {
    var colors = [];

    for (var i = 0; i < (6 * 7); i++) {
        var pi3 = Math.floor(Math.PI / 3);
        var n = (i * (1.0 / 6));
        var r = Math.floor(3 * Math.sin(n) + 3);
        var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
        var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
        colors.push(36 * r + 6 * g + b + 16);
    }

    return colors;
}
