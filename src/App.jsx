import React, { useEffect, useState } from "react";
import { notes } from "./components/notes";
import Guitar from "react-guitar";
import Soundfont from "soundfont-player";
import "./App.css";

const GuitarScale = () => {
  const [piano, setPiano] = useState(null);
  const [notesPlayed, setNotesPlayed] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastMelody, setLastMelody] = useState([]);
  const [numNotes, setNumNotes] = useState(8);
  const [bpm, setBpm] = useState(120);
  const [timeouts, setTimeouts] = useState([]);
  const [selectedNotesArray, setSelectedNotesArray] = useState("cMajor");
  const [pickInstrument, setPickInstrument] = useState("acoustic_guitar_steel");

  const handleNumNotesChange = (event) => {
    const value = event.target.value;
    if (value >= 2 && value <= 14) {
      setNumNotes(value);
    }
  };

  const handleBpmChange = (event) => {
    const value = event.target.value;
    if (value >= 60 && value <= 240) {
      setBpm(value);
    }
  };

  const handleInstrumentChange = (event) => {
    const newInstrument = event.target.value;
    setPickInstrument(newInstrument);
  };

  const stopMelody = () => {
    timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    setNotesPlayed([]);
    // setLastMelody([]);
    setCurrentNote("");
    setIsPlaying(false);
    setTimeouts([]);
  };

  useEffect(() => {
    Soundfont.instrument(new AudioContext(), pickInstrument).then((player) => {
      setPiano(player);
    });
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [pickInstrument]);

  const playRandomMelody = (numNotes, bpm, notesArray) => {
    setIsPlaying(true);
    const melody = [];
    const newTimeouts = [];

    for (let i = 0; i < numNotes; i++) {
      const randomNoteIndex = Math.floor(Math.random() * notesArray.length);
      melody.push(notesArray[randomNoteIndex]);
    }

    setNotesPlayed([]);
    setLastMelody(melody);

    const millisecondsPerBeat = 60000 / bpm;
    let timeoutId;
    let currentIndex = 0;

    const playNote = () => {
      const note = melody[currentIndex];
      if (note) {
        setCurrentNote(note);
        setNotesPlayed((prevNotesPlayed) => [...prevNotesPlayed, note]);
        piano.play(note);
        currentIndex++;
        timeoutId = setTimeout(playNote, millisecondsPerBeat);
        newTimeouts.push(timeoutId);
      } else {
        setCurrentNote("");
        setIsPlaying(false);
      }
    };

    playNote();
    newTimeouts.push(timeoutId);

    setTimeouts(newTimeouts);
  };

  const replayLastMelody = () => {
    if (lastMelody.length > 0) {
      setIsPlaying(true);
      setNotesPlayed([]);
      const millisecondsPerBeat = 60000 / bpm;
      let timeoutId;
      let currentIndex = 0;
      const newTimeouts = [];

      const playNote = () => {
        const note = lastMelody[currentIndex];
        if (note) {
          setCurrentNote(note);
          setNotesPlayed((prevNotesPlayed) => [...prevNotesPlayed, note]);
          piano.play(note);
          currentIndex++;
          timeoutId = setTimeout(playNote, millisecondsPerBeat);
          newTimeouts.push(timeoutId);
        } else {
          setCurrentNote("");
          setIsPlaying(false);
        }
      };

      playNote();
      newTimeouts.push(timeoutId);

      setTimeouts(newTimeouts);
    }
  };

  return (
    <div>
      <select value={pickInstrument} onChange={handleInstrumentChange}>
        <option value="acoustic_guitar_steel">Acoustic Guitar</option>
        <option value="acoustic_grand_piano">Grand Piano</option>
        <option value="taiko_drum">Drums</option>
      </select>
      <select
        value={selectedNotesArray}
        onChange={(event) => setSelectedNotesArray(event.target.value)}
      >
        <option value="cMajor">C Major</option>
        <option value="aMinor">A Minor</option>
        {/* add more options as needed */}
      </select>
      <input type="number" value={numNotes} onChange={handleNumNotesChange} />
      <input type="number" value={bpm} onChange={handleBpmChange} />
      <button
        onClick={() =>
          playRandomMelody(numNotes, bpm, notes[selectedNotesArray])
        }
        disabled={isPlaying}
      >
        Play Random Melody ({numNotes} Notes) at {bpm} BPM
      </button>
      <button
        onClick={replayLastMelody}
        disabled={isPlaying || !lastMelody.length}
      >
        Replay Last Melody
      </button>
      <button disabled={!isPlaying} onClick={stopMelody}>
        Stop
      </button>
      <p>Current Note: {currentNote}</p>
      <div style={{ marginTop: "1rem" }}>
        {notesPlayed.length > 0 && (
          <>
            {notesPlayed.map((note, index) => (
              <span key={index}>{note} </span>
            ))}
            <br />
          </>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Guitar
          tuning={["E4", "B3", "G3", "D3", "A2", "E2"]}
          frets={24}
          fretWidth={50}
          fretHeight={80}
          strings={[
            { note: "E2", color: "white" },
            { note: "A2", color: "white" },
            { note: "D3", color: "white" },
            { note: "G3", color: "white" },
            { note: "B3", color: "white" },
            { note: "E4", color: "white" },
          ]}
          markers={[3, 5, 7, 9, 12, 15, 17, 19, 21]}
          activeNotes={notesPlayed}
          activeColor="red"
          width={700}
          height={300}
        />
      </div>
    </div>
  );
};

export default GuitarScale;
