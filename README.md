# guitar-chord-sequence

This is a very small Javascript library for working with chord sequences on the guitar. It was built exclusively for the [capo.guru](http://capo.guru) project, and therefore might not be that suitable for other projects. Nevertheless, here is an overview:

## Installation

`npm install guitar-chord-sequence --save` or `yarn add guitar-chord-sequence`


## Usage

The module's public interface provides two classes: Sequence and SequenceError. A sequence must be instantiated with a chord progression, represented as an array of objects. The chord objects are very simple objects with two properties: 'root' and 'type'; the 'root' must be a valid note (e.g. 'A', 'C#', 'Eb') and the 'type' must be one of the following types of chord: 'maj', 'min', '7', 'min7', 'maj7' (more will be added at a later date). The roots of the chords are then converted by the class and have a 'num' property instead of the 'root' property (e.g. 'A' becomes 0, 'D' becomes 5), they are converted back when the Sequence object is coerced to a string and when the possible keys of the sequence are returned. If there is a problem with the chord array a SequenceError with be thrown. 

```let sequence = new Sequence([{root: 'A', type: 'maj'}, {root: 'F#', type: 'min'}]);```

The Sequence instance has several available methods:

* `sequence.addChord({root: 'A', type: 'maj'})` will return a new Sequence object with a chord added to the end of the sequence
* `sequence.removeChord({root: 'A', type: 'maj'})` will return a new Sequence object with all instances of that chord removed from the sequence
* `sequence.removeChordByIndex(1)` will return a new Sequence object with the chord at the chosen index removed of the sequence
* `sequence.transpose(5)` will return a new Sequence object, with a transposition applied of the specified number of semitones (any positive or negative integer is valid)
* `sequence.containsChord({root: 'A', type: 'maj'})` will return true/false depending on whether the specified chord can be found in the sequence
* `sequence.containsEveryChord([{root: 'A', type: 'maj'}, {root: 'F#', type: 'min'}])` will return true if every chord in the specified sequence can be found within the initial sequence, and false if not
* `sequence.isOpen()` will return true if the sequence can be played entirely with open chords, there is an optional argument of another chord sequence to specify which chords are considered 'open'. The library's default list does not include Fmajor or Bminor, for example, and these might be required
* `sequence.findOpenPositions()` will return an array of frets on which the position could be played using open chords if a capo were placed there. Also takes an optional argument of 'open' chords
* `sequence.findKeys()` will return an array of possible keys to which the chord sequence could belong

## Tests

Tests can be run using the `npm test` or `yarn test` commands. 
