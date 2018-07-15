// The custom error class for the Sequence class.
class SequenceError extends Error {};

let notes = ['A', ['A#', 'Bb'], 'B', 'C', ['C#', 'Db'], 'D', ['D#', 'Eb'], 'E', 'F', ['F#', 'Gb'], 'G', ['G#', 'Ab']];

let types = ['maj', 'min', '7', 'min7', 'maj7'];

let defaultOpenChords = [
    {root: 'A', type: 'maj'}, {root: 'A', type: 'min'}, {root: 'A', type: '7'}, {root: 'A', type: 'min7'},
    {root: 'A', type: 'maj7'}, {root: 'C', type: 'maj'}, {root: 'C', type: '7'}, {root: 'D', type: 'maj'}, 
    {root: 'D', type: 'min'}, {root: 'D', type: '7'}, {root: 'D', type: 'min7'}, {root: 'D', type: 'maj7'}, 
    {root: 'E', type: 'maj'}, {root: 'E', type: 'min'}, {root: 'E', type: '7'}, {root: 'E', type: 'min7'}, 
    {root: 'E', type: 'maj7'}, {root: 'G', type: 'maj'}, {root: 'G', type: '7'}
];

// All chords in A major. This is then transposed to find the possible keys of any given sequence. 
let aMajorChords = [
    {root: 'A', type: 'maj'}, {root: 'A', type: 'maj7'}, {root: 'B', type: 'min'}, {root: 'B', type: 'min7'},
    {root: 'C#', type: 'min'}, {root: 'C#', type: 'min7'}, {root: 'D', type: 'maj'}, {root: 'D', type: 'maj7'},
    {root: 'E', type: 'maj'}, {root: 'E', type: '7'}, {root: 'F#', type: 'min'}, {root: 'F#', type: 'min7'}
];

// Converts a note (e.g. C#) to an integer used in the Sequence object.
let noteLetterToNumber = function(letter) {
    for (let i = 0; i < notes.length; i++) {
        if ((typeof notes[i] == 'string' && letter == notes[i]) ||
            (typeof notes[i] == 'object' && notes[i].indexOf(letter) != -1)) {
            return i;
        }
    }
    throw new Error('Invalid chord root');
};

let isChordInputValid = function(chord) {
    return (
        chord.hasOwnProperty('type') && 
        (chord.hasOwnProperty('root') || chord.hasOwnProperty('num')));
};

// Turns the input chord into an object usable by the Sequence object.
let formatInputChord = function(chord) {
    if (!isChordInputValid(chord)) throw new Error('Incorrect chord format');
    let formattedChord = {};
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

let transposeChord = function(chord, semitones) {
    // Transposing by more than 12 (an octave) is useless.
    let newNum = (chord.num + semitones) % 12;
    // We need our chord num to be between 0 and 11 inclusive.
    if (newNum < 0)
        newNum = newNum + 12;
    return {
        num: newNum,
        type: chord.type
    }
};

// Lets us compare chord objects.
let chordsAreEqual = function(chord1, chord2) {
    return (chord1.num == chord2.num && chord1.type == chord2.type);
};

// Converts a note num string (e.g. 4 becomes 'C#/Db).
let noteToString = function(note) {
    if (typeof notes[note] == 'string') {
        return notes[note];
    } else {
        return notes[note].join('/');
    }
}

// Converts the entire chord object to a string.
let chordToString = function(chord) {
    let string = noteToString(chord.num);
    if (chord.type != 'maj') 
        string += ' ' + chord.type;
    return string;
};


class Sequence {

    constructor(chords) {
        try {
            this.chords = chords.map(formatInputChord);
        } catch (error) {
            throw new SequenceError(error);
        }
    }

    // Return the entire sequence as a string.
    toString() {
        return this.chords.map(chord => chordToString(chord)).join(', ');
    }

    // Returns a version of the chords array with more data (root and string).
    fullChords() {
        return this.chords.map(chord => {
            return {
                num: chord.num, 
                root: noteToString(chord.num),
                type: chord.type,
                string: chordToString(chord)
            }
        });
    }

    addChord(chordToAdd) {
        try {
            return new Sequence([...this.chords, formatInputChord(chordToAdd)]);
        } catch (error) {
            throw new SequenceError(error);
        }
    }

    // Removes all instances of a chord from the sequence, by name.
    removeChord(chordToRemove) {
        try {
            return new Sequence(this.chords.filter(chord => !chordsAreEqual(chord, formatInputChord(chordToRemove))));
        } catch (error) {
            throw new SequenceError(error);
        }
    }

    removeChordByIndex(chordIndex) {
        if (chordIndex < 0 || chordIndex >= this.chords.length) throw new SequenceError('Invalid index');
        return new Sequence(this.chords.filter((chord, index) => index != chordIndex));
    }

    transpose(semitones) {
        if (this.chords.length) {
            if (isNaN(semitones)) throw new SequenceError('Invalid transposition');
            semitones = parseInt(semitones);
            return new Sequence(this.chords.map(chord => transposeChord(chord, semitones)));
        }
    }

    containsChord(searchChord) {
        if (this.chords.length) {
            try {
                searchChord = formatInputChord(searchChord);
            } catch (error) {
                throw new SequenceError(error);
            }
            return this.chords.some(chord => chordsAreEqual(chord, searchChord));
        }
    }

    // Returns true if the sequence contains every chord in the argument sequence.
    containsEveryChord(searchSequence) {
        if (this.chords.length) {
            return searchSequence.every(chord => this.containsChord(chord));
        }
    }

    /**
    * Returns true if every chord in the sequence can be played using open chords.
    * The chords considered to be open can be specified as an optional argument. 
    * You might consider F and Bminor to be open chords. 
    */
    isOpen(openChords = defaultOpenChords) {
        if (this.chords.length) {
            if (!(openChords instanceof Sequence)) openChords = new Sequence(openChords);
            return openChords.containsEveryChord(this.chords);
        }
    }

    /** 
     * Finds every position in which it would be possible to position a capo 
     * and play the sequence with open chords. 
     */
    findOpenPositions(openChords = defaultOpenChords) {
        let openSequences = [];
        if (this.chords.length) {
            for (let i = 1; i <= 11; i++) {
                let transposedSequence = this.transpose(-i);
                if (transposedSequence.isOpen(openChords))
                    openSequences.push({fret: i, sequence: transposedSequence});
            }
        }
        return openSequences;

    }

    // Finds all possible keys to which the sequence could belong.
    findKeys() {
        let keys = [];
        if (this.chords.length) {
            let keyOfA = new Sequence(aMajorChords);
            for (let i = 0; i <= 11; i++) {
                let newKey = keyOfA.transpose(i);
                if (newKey.containsEveryChord(this.chords))
                    keys.push({root: noteToString(i), num: i});
            }
        }
        return keys;
    }

}

/**
 * The custom iterator class for the Sequence class. 
 * Returns a string for each chord in the sequence.
 */
class SequenceIterator {
    constructor(sequence) {
        this.chordIndex = 0;
        this.sequence = sequence;
    }
    next() {
        if (this.chordIndex == this.sequence.chords.length) return {done: true};
        let value = chordToString(this.sequence.chords[this.chordIndex]);
        this.chordIndex++;
        return {value, done: false};
    }
}

Sequence.prototype[Symbol.iterator] = function() {
  return new SequenceIterator(this);
};

module.exports = {
    SequenceError,
    Sequence,
};
