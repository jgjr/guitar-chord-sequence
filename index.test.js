const {Sequence, SequenceError} = require('./index');

test('Init sequence', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}]);
    expect(seq.chords).toEqual([{num: 0, type: 'maj'}]);
});

test('Init sequence different cases', () => {
    let seq = new Sequence([{root: 'a', type: 'MAJ'}]);
    expect(seq.chords).toEqual([{num: 0, type: 'maj'}]);
});

test('Init bad sequence property names', () => {
    expect(() => new Sequence([{a: 'A', b: 'maj'}])).toThrow(SequenceError);
});

test('Init bad sequence chord root', () => {
    expect(() => new Sequence([{root: 'H', type: 'maj'}])).toThrow(SequenceError);
});

test('To string', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'E', type: '7'}]);
    expect(String(seq)).toEqual('A, B min, E 7');
});

test('Full chords', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(seq.fullChords()[0]).toEqual({num: 0, root: 'A', type: 'maj', string: 'A'});
});

test('Add chord', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}]);
    let seq2 = seq.addChord({root: 'B', type: 'min'});
    expect(seq.chords).toEqual([{num: 0, type: 'maj'}]);
    expect(seq2.chords).toEqual([{num: 0, type: 'maj'}, {num: 2, type: 'min'}]);
});

test('Add chord bad input', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}]);
    expect(() => seq.addChord({root: 'H', b: 'min'})).toThrow(SequenceError);
});

test('Remove chord', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    let seq2 = seq.removeChord({root: 'B', type: 'min'});
    expect(seq.chords).toEqual([{num: 0, type: 'maj'}, {num: 2, type: 'min'}]);
    expect(seq2.chords).toEqual([{num: 0, type: 'maj'}]);
});

test('Remove chord bad input', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(() => seq.addChord({root: 'H', b: 'min'})).toThrow(SequenceError);
});

test('Remove chord by index', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    let seq2 = seq.removeChordByIndex(1);
    expect(seq.chords).toEqual([{num: 0, type: 'maj'}, {num: 2, type: 'min'}, {num: 4, type: 'min'}]);
    expect(seq2.chords).toEqual([{num: 0, type: 'maj'}, {num: 4, type: 'min'}]);
});

test('Remove chord by index bad input', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    expect(() => seq.removeChordByIndex(5)).toThrow(SequenceError);
});

test('Transpose up', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'G#', type: 'maj'}]);
    let transposed_seq = seq.transpose(3);
    expect(transposed_seq.chords).toEqual([{num: 3, type: 'maj'}, {num: 5, type: 'min'}, {num: 2, type: 'maj'}]);
});

test('Transpose up > octave', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'G#', type: 'maj'}]);
    let transposed_seq = seq.transpose(15);
    expect(transposed_seq.chords).toEqual([{num: 3, type: 'maj'}, {num: 5, type: 'min'}, {num: 2, type: 'maj'}]);
});

test('Transpose down', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    let transposed_seq = seq.transpose(-3);
    expect(transposed_seq.chords).toEqual([{num: 9, type: 'maj'}, {num: 11, type: 'min'}]);
});

test('Transpose down > octave', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    let transposed_seq = seq.transpose(-15);
    expect(transposed_seq.chords).toEqual([{num: 9, type: 'maj'}, {num: 11, type: 'min'}]);
});

test('Transpose bad interval', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(() => seq.transpose('asdf')).toThrow(SequenceError);
});

test('Contains chord true', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(seq.containsChord({root: 'B', type: 'min'})).toBe(true);
});

test('Contains chord false', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(seq.containsChord({root: 'B', type: '7'})).toBe(false);
});

test('Contains chord bad chord', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(() => seq.containsChord({root: 'H', type: 'min'})).toThrow(SequenceError);
});

test('Contains every chord true', () => {
    let seq1 = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    let seq2 = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(seq1.containsEveryChord(seq2.chords)).toBe(true);
});

test('Contains every chord false', () => {
    let seq1 = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    let seq2 = new Sequence([{root: 'A', type: 'maj'}, {root: 'D', type: 'maj'}]);
    expect(seq1.containsEveryChord(seq2.chords)).toBe(false);
});

test('Is open default chords true', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'D', type: 'maj'}, {root: 'E', type: 'maj'}]);
    expect(seq.isOpen()).toBe(true);
});

test('Is open custom chords true', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'E', type: 'maj'}]);
    let openChords = [{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C', type: 'maj'},  {root: 'E', type: 'maj'}];
    expect(seq.isOpen(openChords)).toBe(true);
});

test('Is open custom chord sequence true', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'E', type: 'maj'}]);
    let openChords = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C', type: 'maj'},  {root: 'E', type: 'maj'}]);
    expect(seq.isOpen(openChords)).toBe(true);
});

test('Is open default chords false', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'E', type: 'maj'}]);
    expect(seq.isOpen()).toBe(false);
});

test('Is open custom chords false', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    let openChords = [{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C', type: 'maj'},  {root: 'E', type: 'maj'}];
    expect(seq.isOpen(openChords)).toBe(false);
});

test('Find open positions default chords', () => {
    let seq = new Sequence([{root: 'G#', type: 'maj'}, {root: 'C#', type: 'maj'}, {root: 'F', type: 'min'}]);
    let openSequences = seq.findOpenPositions();
    expect(openSequences[0].fret).toBe(1);
});

test('Find open positions custom chords', () => {
    let openChords = [{root: 'C', type: 'maj'}, {root: 'F', type: 'maj'}, {root: 'A', type: 'min'}];
    let seq = new Sequence([{root: 'D', type: 'maj'}, {root: 'G', type: 'maj'}, {root: 'B', type: 'min'}]);
    let openSequences = seq.findOpenPositions(openChords);
    expect(openSequences[0].fret).toBe(2);
});

test('Find open positions no results', () => {
    let seq = new Sequence([{root: 'G', type: 'maj'}, {root: 'G#', type: 'maj'}, {root: 'A', type: 'min'}]);
    expect(seq.findOpenPositions()).toEqual([]);
});

test('Find keys', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}]);
    expect(seq.findKeys()).toEqual([{root:'A', num: 0}, {root:'D', num: 5}]);
});

test('Find keys no results', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'A#', type: 'min'}]);
    expect(seq.findKeys()).toEqual([]);
});

test('Find keys empty sequence', () => {
    let seq = new Sequence([]);
    expect(seq.findKeys()).toEqual([]);
});

test('Iterating', () => {
    let seq = new Sequence([{root: 'A', type: 'maj'}, {root: 'B', type: 'min'}, {root: 'C#', type: 'min'}]);
    let strings = [];
    for (let chord of seq) {
        strings.push(chord);
    }
    expect(strings[0]).toBe('A');
    expect(strings[1]).toBe('B min');
    expect(strings[2]).toBe('C#/Db min');
});

