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

let aMajorChords = [
    {root: 'A', type: 'maj'}, {root: 'A', type: 'maj7'}, {root: 'B', type: 'min'}, {root: 'B', type: 'min7'},
    {root: 'C#', type: 'min'}, {root: 'C#', type: 'min7'}, {root: 'D', type: 'maj'}, {root: 'D', type: 'maj7'},
    {root: 'E', type: 'maj'}, {root: 'E', type: '7'}, {root: 'F#', type: 'min'}, {root: 'F#', type: 'min7'}
];

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
    let newNum = (chord.num + semitones) % 12;
    if (newNum < 0) {
        newNum = newNum + 12;
    }
    return {
        num: newNum,
        type: chord.type
    }
};

let chordsAreEqual = function(chord1, chord2) {
    return (chord1.num == chord2.num && chord1.type == chord2.type);
};

let noteToString = function(note) {
    if (typeof notes[note] == 'string') {
        return notes[note];
    } else {
        return notes[note][0];
    }
}

let chordToString = function(chord) {
    let string = noteToString(chord.num);
    if (chord.type != 'maj') 
        string += chord.type;
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

    toString() {
        return this.chords.map(chord => chordToString(chord)).join(', ');
    }

    addChord(chordToAdd) {
        try {
            this.chords.push(formatInputChord(chordToAdd));
        } catch (error) {
            throw new SequenceError(error);
        }
    }

    removeChord(chordToRemove) {
        try {
            chordToRemove = formatInputChord(chordToRemove);
        } catch (error) {
            throw new SequenceError(error);
        }
        this.chords = this.chords.filter(chord => !chordsAreEqual(chord, chordToRemove));
    }

    removeChordByIndex(chordIndex) {
        if (chordIndex < 0 || chordIndex >= this.chords.length) throw new SequenceError('Invalid index');
        this.chords.splice(chordIndex, 1);
    }

    transpose(semitones) {
        if (isNaN(semitones)) throw new SequenceError('Invalid transposition');
        semitones = parseInt(semitones);
        return new Sequence(this.chords.map(chord => transposeChord(chord, semitones)));
    }

    containsChord(searchChord) {
        try {
            searchChord = formatInputChord(searchChord);
        } catch (error) {
            throw new SequenceError(error);
        }
        return this.chords.some(chord => chordsAreEqual(chord, searchChord));
    }

    containsEveryChord(searchSequence) {
        return searchSequence.every(chord => this.containsChord(chord));
    }

    isOpen(openChords = defaultOpenChords) {
        if (!(openChords instanceof Sequence)) openChords = new Sequence(openChords);
        return openChords.containsEveryChord(this.chords);
    }

    findOpenPositions(openChords = defaultOpenChords) {
        let openSequences = [];
        for (let i = 0; i <= 11; i++) {
            let transposedSequence = this.transpose(-i);
            if (transposedSequence.isOpen(openChords))
                openSequences.push({fret: i, sequence: transposedSequence});
        }
        return openSequences;
    }

    findKeys() {
        let keys = [];
        let keyOfA = new Sequence(aMajorChords);
        for (let i = 0; i <= 11; i++) {
            let newKey = keyOfA.transpose(i);
            if (newKey.containsEveryChord(this.chords))
                keys.push({root: noteToString(i), num: i});
        }
        return keys;
    }

}

module.exports = {
    SequenceError,
    Sequence,
};
