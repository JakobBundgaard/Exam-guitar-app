const root = document.documentElement;

const fretboard = document.querySelector(".fretboard");
const selectedInstrumentSelector = document.querySelector("#instrument-selector");
const accidentalSelector = document.querySelector(".accidental-selector");
const numberOfFretsSelector = document.querySelector("#number-of-frets");
const showAllNotesSelector = document.querySelector("#show-all-notes");
const showMultipleNotesSelector = document.querySelector("#show-multiple-notes");
const noteNameSection = document.querySelector(".note-name-section")

let allNotes;
let showMultipleNotes = false;

let numberOfFrets = 20;


const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];

// Array of notes
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let accidentals = "flats";

// Object with arrays of tunings
const instrumentTuningPresets = {
    "Guitar (6 string)": [4, 11, 7, 2, 9, 4],
    "Guitar (7 string)": [4, 11, 7, 2, 9, 4, 11],
    "Bass (4 string)": [7, 2, 9, 4],
    "Bass (5 string)": [7, 2, 9, 4, 11]

};

let selectedInstrument = "Guitar (6 string)";

let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;

const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector();
        this.setupNoteNameSection();
        this.setupEventListeners();
    },
    setupFretboard() {
        fretboard.innerHTML = "";
        root.style.setProperty("--number-of-strings", numberOfStrings);
        // Add string to fretboard
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement("div");
            string.classList.add("string");
            fretboard.appendChild(string);

            // Create frets
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement("div");
                noteFret.classList.add("note-fret");
                string.appendChild(noteFret);

                // start on fret 0 want to add the first number of tuning array i
                // so at fret 0 we add i for selected instrument, which is 4 for a guitar, s0 we cant count the tuning array
                // and find the note for the position
                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute("data-note", noteName);

                // Add  single fretmarks. 
                //Vi checker om vi er på første streng(vi har kun brug for at tilføje fretmarks en gang)
                // og om indexof fret er indeholdene i singleFretmark positions og hvis det er true tilføjer vi fretmark
                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add("single-fretmark");
                }

                // Add double fretmarks
                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement("div");
                    doubleFretMark.classList.add("double-fretmark");
                    noteFret.appendChild(doubleFretMark);
                }
            }
        }
        allNotes = document.querySelectorAll(".note-fret");
    },
    generateNoteNames(noteIndex, accidentals) {
        // Getting noteNames see video 9
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === "flats") {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === "sharps") {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupSelectedInstrumentSelector() {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement("option", instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },
    setupNoteNameSection() {
        noteNameSection.innerHTML = "";
        let noteNames;
        if (accidentals === "flats") {
            noteNames = notesFlat;
        } else {
            noteNames = notesSharp;
        }
        noteNames.forEach((noteName) => {
            let noteNameElement = tools.createElement("span", noteName);
            noteNameSection.appendChild(noteNameElement);
        });
    },
    showNoteDot(event) {
        if (event.target.classList.contains("note-fret")) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 1);
            } else {
                event.target.style.setProperty("--noteDotOpacity", 1);
            }
        }
    },
    hideNoteDot(event) {
        if (showMultipleNotes) {
            app.toggleMultipleNotes(event.target.dataset.note, 0);
        } else {
            event.target.style.setProperty("--noteDotOpacity", 0);
        }

    },
    setupEventListeners() {
        fretboard.addEventListener("mouseover", this.showNoteDot);
        fretboard.addEventListener("mouseout", this.hideNoteDot);

        selectedInstrumentSelector.addEventListener("change", (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });

        accidentalSelector.addEventListener("click", (event) => {
            if (event.target.classList.contains("acc-select")) {
                accidentals = event.target.value;
                this.setupFretboard();
                this.setupNoteNameSection();
            } else {
                return;
            }
        });

        numberOfFretsSelector.addEventListener("change", () => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });

        showAllNotesSelector.addEventListener("change", () => {
            if (showAllNotesSelector.checked) {
                root.style.setProperty("--noteDotOpacity", 1);
                fretboard.removeEventListener("mouseover", this.showNoteDot);
                fretboard.removeEventListener("mouseout", this.hideNoteDot);
                this.setupFretboard();
            } else {
                root.style.setProperty("--noteDotOpacity", 0);
                fretboard.addEventListener("mouseover", this.showNoteDot);
                fretboard.addEventListener("mouseout", this.hideNoteDot);
                this.setupFretboard();
            }
        });

        showMultipleNotesSelector.addEventListener("change", () => {
            showMultipleNotes = !showMultipleNotes;
        });

        noteNameSection.addEventListener("mouseover", (event) => {
            let noteToShow = event.target.innerText;
            // Using app and not this because we are in the callback of the eventlistener and dont have access to this
            app.toggleMultipleNotes(noteToShow, 1);
        });

        noteNameSection.addEventListener("mouseout", (event) => {
            if (!showAllNotesSelector.checked) {
                let noteToShow = event.target.innerText;
                // Using app and not this because we are in the callback of the eventlistener and dont have access to this
                app.toggleMultipleNotes(noteToShow, 0);
            } else {
                return;
            }


        });
    },
    toggleMultipleNotes(noteName, opacity) {
        for (i = 0; i < allNotes.length; i++) {
            if (allNotes[i].dataset.note === noteName) {
                allNotes[i].style.setProperty("--noteDotOpacity", opacity);
            }
        }
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();