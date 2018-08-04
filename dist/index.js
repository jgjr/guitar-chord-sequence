'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The custom error class for the Sequence class.
var SequenceError = function (_Error) {
    _inherits(SequenceError, _Error);

    function SequenceError() {
        _classCallCheck(this, SequenceError);

        return _possibleConstructorReturn(this, (SequenceError.__proto__ || Object.getPrototypeOf(SequenceError)).apply(this, arguments));
    }

    return SequenceError;
}(Error);

;

var notes = ['A', ['A#', 'Bb'], 'B', 'C', ['C#', 'Db'], 'D', ['D#', 'Eb'], 'E', 'F', ['F#', 'Gb'], 'G', ['G#', 'Ab']];

var types = ['maj', 'min', '7', 'min7', 'maj7'];

var defaultOpenChords = [{ root: 'A', type: 'maj' }, { root: 'A', type: 'min' }, { root: 'A', type: '7' }, { root: 'A', type: 'min7' }, { root: 'A', type: 'maj7' }, { root: 'C', type: 'maj' }, { root: 'C', type: '7' }, { root: 'D', type: 'maj' }, { root: 'D', type: 'min' }, { root: 'D', type: '7' }, { root: 'D', type: 'min7' }, { root: 'D', type: 'maj7' }, { root: 'E', type: 'maj' }, { root: 'E', type: 'min' }, { root: 'E', type: '7' }, { root: 'E', type: 'min7' }, { root: 'E', type: 'maj7' }, { root: 'G', type: 'maj' }, { root: 'G', type: '7' }];

// All chords in A major. This is then transposed to find the possible keys of any given sequence. 
var aMajorChords = [{ root: 'A', type: 'maj' }, { root: 'A', type: 'maj7' }, { root: 'B', type: 'min' }, { root: 'B', type: 'min7' }, { root: 'C#', type: 'min' }, { root: 'C#', type: 'min7' }, { root: 'D', type: 'maj' }, { root: 'D', type: 'maj7' }, { root: 'E', type: 'maj' }, { root: 'E', type: '7' }, { root: 'F#', type: 'min' }, { root: 'F#', type: 'min7' }];

// Converts a note (e.g. C#) to an integer used in the Sequence object.
var noteLetterToNumber = function noteLetterToNumber(letter) {
    for (var i = 0; i < notes.length; i++) {
        if (typeof notes[i] == 'string' && letter == notes[i] || _typeof(notes[i]) == 'object' && notes[i].indexOf(letter) != -1) {
            return i;
        }
    }
    throw new Error('Invalid chord root');
};

var isChordInputValid = function isChordInputValid(chord) {
    return chord.hasOwnProperty('type') && (chord.hasOwnProperty('root') || chord.hasOwnProperty('num'));
};

// Turns the input chord into an object usable by the Sequence object.
var formatInputChord = function formatInputChord(chord) {
    if (!isChordInputValid(chord)) throw new Error('Incorrect chord format');
    var formattedChord = {};
    if (chord.hasOwnProperty('num')) {
        if (chord.num < 0 || chord.num > 11) throw new Error('Invalid chord number');
        formattedChord.num = chord.num;
    } else {
        formattedChord.num = noteLetterToNumber(chord.root.toUpperCase());
    }
    if (types.indexOf(chord.type.toLowerCase()) == -1) throw new Error('Invalid chord type');
    formattedChord.type = chord.type.toLowerCase();
    return formattedChord;
};

var transposeChord = function transposeChord(chord, semitones) {
    // Transposing by more than 12 (an octave) is useless.
    var newNum = (chord.num + semitones) % 12;
    // We need our chord num to be between 0 and 11 inclusive.
    if (newNum < 0) newNum = newNum + 12;
    return {
        num: newNum,
        type: chord.type
    };
};

// Lets us compare chord objects.
var chordsAreEqual = function chordsAreEqual(chord1, chord2) {
    return chord1.num == chord2.num && chord1.type == chord2.type;
};

// Converts a note num string (e.g. 4 becomes 'C#/Db).
var noteToString = function noteToString(note) {
    if (typeof notes[note] == 'string') {
        return notes[note];
    } else {
        return notes[note].join('/');
    }
};

// Converts the entire chord object to a string.
var chordToString = function chordToString(chord) {
    var string = noteToString(chord.num);
    if (chord.type != 'maj') string += ' ' + chord.type;
    return string;
};

var Sequence = function () {
    function Sequence(chords) {
        _classCallCheck(this, Sequence);

        try {
            this.chords = chords.map(formatInputChord);
        } catch (error) {
            throw new SequenceError(error);
        }
    }

    // Return the entire sequence as a string.


    _createClass(Sequence, [{
        key: 'toString',
        value: function toString() {
            return this.chords.map(function (chord) {
                return chordToString(chord);
            }).join(', ');
        }

        // Returns a version of the chords array with more data (root and string).

    }, {
        key: 'fullChords',
        value: function fullChords() {
            return this.chords.map(function (chord) {
                return {
                    num: chord.num,
                    root: noteToString(chord.num),
                    type: chord.type,
                    string: chordToString(chord)
                };
            });
        }
    }, {
        key: 'addChord',
        value: function addChord(chordToAdd) {
            try {
                return new Sequence([].concat(_toConsumableArray(this.chords), [formatInputChord(chordToAdd)]));
            } catch (error) {
                throw new SequenceError(error);
            }
        }

        // Removes all instances of a chord from the sequence, by name.

    }, {
        key: 'removeChord',
        value: function removeChord(chordToRemove) {
            try {
                return new Sequence(this.chords.filter(function (chord) {
                    return !chordsAreEqual(chord, formatInputChord(chordToRemove));
                }));
            } catch (error) {
                throw new SequenceError(error);
            }
        }
    }, {
        key: 'removeChordByIndex',
        value: function removeChordByIndex(chordIndex) {
            if (chordIndex < 0 || chordIndex >= this.chords.length) throw new SequenceError('Invalid index');
            return new Sequence(this.chords.filter(function (chord, index) {
                return index != chordIndex;
            }));
        }
    }, {
        key: 'transpose',
        value: function transpose(semitones) {
            if (this.chords.length) {
                if (isNaN(semitones)) throw new SequenceError('Invalid transposition');
                semitones = parseInt(semitones);
                return new Sequence(this.chords.map(function (chord) {
                    return transposeChord(chord, semitones);
                }));
            }
        }
    }, {
        key: 'containsChord',
        value: function containsChord(searchChord) {
            if (this.chords.length) {
                try {
                    searchChord = formatInputChord(searchChord);
                } catch (error) {
                    throw new SequenceError(error);
                }
                return this.chords.some(function (chord) {
                    return chordsAreEqual(chord, searchChord);
                });
            }
        }

        // Returns true if the sequence contains every chord in the argument sequence.

    }, {
        key: 'containsEveryChord',
        value: function containsEveryChord(searchSequence) {
            var _this2 = this;

            if (this.chords.length) {
                return searchSequence.every(function (chord) {
                    return _this2.containsChord(chord);
                });
            }
        }

        /**
        * Returns true if every chord in the sequence can be played using open chords.
        * The chords considered to be open can be specified as an optional argument. 
        * You might consider F and Bminor to be open chords. 
        */

    }, {
        key: 'isOpen',
        value: function isOpen() {
            var openChords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOpenChords;

            if (this.chords.length) {
                if (!(openChords instanceof Sequence)) openChords = new Sequence(openChords);
                return openChords.containsEveryChord(this.chords);
            }
        }

        /** 
         * Finds every position in which it would be possible to position a capo 
         * and play the sequence with open chords. 
         */

    }, {
        key: 'findOpenPositions',
        value: function findOpenPositions() {
            var openChords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOpenChords;

            var openSequences = [];
            if (this.chords.length) {
                for (var i = 1; i <= 11; i++) {
                    var transposedSequence = this.transpose(-i);
                    if (transposedSequence.isOpen(openChords)) openSequences.push({ fret: i, sequence: transposedSequence });
                }
            }
            return openSequences;
        }

        // Finds all possible keys to which the sequence could belong.

    }, {
        key: 'findKeys',
        value: function findKeys() {
            var keys = [];
            if (this.chords.length) {
                var keyOfA = new Sequence(aMajorChords);
                for (var i = 0; i <= 11; i++) {
                    var newKey = keyOfA.transpose(i);
                    if (newKey.containsEveryChord(this.chords)) keys.push({ root: noteToString(i), num: i });
                }
            }
            return keys;
        }
    }]);

    return Sequence;
}();

/**
 * The custom iterator class for the Sequence class. 
 * Returns a string for each chord in the sequence.
 */


var SequenceIterator = function () {
    function SequenceIterator(sequence) {
        _classCallCheck(this, SequenceIterator);

        this.chordIndex = 0;
        this.sequence = sequence;
    }

    _createClass(SequenceIterator, [{
        key: 'next',
        value: function next() {
            if (this.chordIndex == this.sequence.chords.length) return { done: true };
            var value = chordToString(this.sequence.chords[this.chordIndex]);
            this.chordIndex++;
            return { value: value, done: false };
        }
    }]);

    return SequenceIterator;
}();

Sequence.prototype[Symbol.iterator] = function () {
    return new SequenceIterator(this);
};

module.exports = {
    SequenceError: SequenceError,
    Sequence: Sequence,
    defaultOpenChords: defaultOpenChords
};