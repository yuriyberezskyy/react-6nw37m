import React, { useState, useEffect } from 'react';
import Note from './components/Note.js';
import './style.css';
import axios from 'axios';
import noteService from './services/notes.js';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  //Adding note
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random < 0.5,
      id: notes.length + 1,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });
  };

  //New node typing area
  const handleOnChage = (event) => {
    setNewNote(event.target.value);
  };

  //Condition
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  //Show all or important notes
  const handleClick = () => {
    setShowAll(!showAll);
  };

  // Search are typing area
  const searchTextChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredNotes = notes.filter((note) => note.content.includes(search));

  // Toggle button for changing importance of the task
  const toggleImportance = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService.update(id, changedNote).then((returnedNote) => {
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    });
  };

  return (
    <div>
      <h1>Notes</h1>
      <h3>Search</h3>

      <div>
        <input
          placeholder="Search..."
          type="text"
          value={search}
          onChange={searchTextChange}
        />
      </div>
      <br />
      {search.length > 0 ? (
        <div>
          {filteredNotes.map((note, i) => (
            <Note
              key={i}
              note={note}
              toggleImportance={() => toggleImportance(note.id)}
            />
          ))}{' '}
        </div>
      ) : (
        <div>
          <button onClick={handleClick}>
            {showAll ? 'Show Important' : 'Show All'}
          </button>
          <ul>
            {notesToShow.map((note, i) => (
              <Note
                key={i}
                note={note}
                toggleImportance={() => toggleImportance(note.id)}
              />
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={addNote}>
        <h1>Add Note</h1>
        <input
          type="text"
          id="note"
          placeholder="Add note ..."
          value={newNote}
          onChange={handleOnChage}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
