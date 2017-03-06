module.exports = Fonts;

var subzero = require('./subzero.js'),
    isometric = require('./isometric.js');
    smallIsometric = require('./small-isometric.js'),
    ascii3d = require('./3D-ascii.js');

function Fonts () {
    var self = {
        makeWord: makeWord
    };

    function makeWord (options) {
        var font = getFont(options.font),
            indent = typeof options.indent === 'number' ? options.indent : 0,
            letters = getLetters(font, options.word),
            iLine, iLetter, iDent, line, output = [];

        for (iLine = 0; iLine < font.height; iLine += 1) {
            line = [];

            for (iDent = 0; iDent < indent; iDent += 1) {
                line.push(' ');
            }

            for (iLetter = 0; iLetter < letters.length; iLetter += 1) {
                line = line.concat(makeCharacters(letters[iLetter], iLine));
            }

            line.push('\n');
            output.push(line);
        }

        function getLetters (font, word) {
            var letters = [], i;

            for (i = 0; i < word.length; i += 1) {
                if (word[i] === ' ') {
                    letters.push(font.letters.space);
                } else if (font.letters[word[i].toLowerCase()]) {
                    letters.push(font.letters[word[i].toLowerCase()]);
                }
            }

            return letters;
        }

        function makeCharacters (letter, line) {
            var chars = [], i;

            for (i = 0; i < letter[line].length; i += 1) {
                chars.push(letter[line][i]);
            }

            return chars;
        }

        return output;
    }

    return self;
}

function getFont (fontName) {
    switch (fontName) {
        case 'subzero':
            return subzero;
        case 'isometric':
            return isometric;
        case 'small-isometric':
            return smallIsometric;
        case '3D-ascii':
            return ascii3d;
        default:
            return subzero;
    }
}
