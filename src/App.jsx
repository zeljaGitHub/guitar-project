import React, { useEffect, useState } from "react";
import Soundfont from "soundfont-player";
import "./App.css";

const GuitarScale = () => {
  const [piano, setPiano] = useState(null);
  const [notesPlayed, setNotesPlayed] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastMelody, setLastMelody] = useState([]);
  const [numNotes, setNumNotes] = useState(8);

  const handleNumNotesChange = (event) => {
    setNumNotes(event.target.value);
  };

  useEffect(() => {
    Soundfont.instrument(new AudioContext(), "acoustic_guitar_steel").then(
      (player) => {
        setPiano(player);
      }
    );
  }, []);

  const playCmajorScale = () => {
    setIsPlaying(true);
    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

    notes.forEach((note, index) => {
      setTimeout(() => {
        setCurrentNote(note);
        piano.play(note);
        if (index === notes.length - 1) {
          setTimeout(() => {
            setCurrentNote("");
            setIsPlaying(false);
          }, 500);
        }
      }, index * 500);
    });
  };

  const playReverseCmajorScale = () => {
    setIsPlaying(true);
    const notes = ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"];

    notes.forEach((note, index) => {
      setTimeout(() => {
        setCurrentNote(note);
        piano.play(note);
        if (index === notes.length - 1) {
          setTimeout(() => {
            setCurrentNote("");
            setIsPlaying(false);
          }, 500);
        }
      }, index * 500);
    });
  };

  const playRandomMelody = (numNotes) => {
    setIsPlaying(true);
    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    const melody = [];

    for (let i = 0; i < numNotes; i++) {
      const randomNoteIndex = Math.floor(Math.random() * notes.length);
      melody.push(notes[randomNoteIndex]);
    }

    setNotesPlayed([]);
    setLastMelody(melody);
    melody.forEach((note, index) => {
      setTimeout(() => {
        if (note) {
          setCurrentNote(note);
          setNotesPlayed((prevNotesPlayed) => [...prevNotesPlayed, note]);
          piano.play(note);
          if (index === melody.length - 1) {
            setTimeout(() => {
              setCurrentNote("");
              setIsPlaying(false);
            }, melody.length * 100);
          }
        }
      }, index * 500);
    });
  };

  const replayLastMelody = () => {
    if (lastMelody.length > 0) {
      setIsPlaying(true);
      setNotesPlayed([]);
      lastMelody.forEach((note, index) => {
        setTimeout(() => {
          if (note) {
            setCurrentNote(note);
            setNotesPlayed((prevNotesPlayed) => [...prevNotesPlayed, note]);
            piano.play(note);
            if (index === lastMelody.length - 1) {
              setTimeout(() => {
                setCurrentNote("");
                setIsPlaying(false);
              }, lastMelody.length * 100);
            }
          }
        }, index * 500);
      });
    }
  };

  return (
    <div>
      <h1>Play C Major Scale on Guitar</h1>
      <button onClick={playCmajorScale} disabled={isPlaying}>
        Play C Major Scale
      </button>
      <button onClick={playReverseCmajorScale} disabled={isPlaying}>
        Play Reverse C Major Scale
      </button>
      <input
        type="number"
        min="2"
        max="14"
        value={numNotes}
        onChange={handleNumNotesChange}
      />
      <button onClick={() => playRandomMelody(numNotes)} disabled={isPlaying}>
        Play Random Melody ({numNotes} Notes)
      </button>

      <button
        onClick={replayLastMelody}
        disabled={isPlaying || !lastMelody.length}
      >
        Replay Last Melody
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
    </div>
  );
};

export default GuitarScale;
