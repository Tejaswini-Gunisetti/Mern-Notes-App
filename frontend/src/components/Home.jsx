import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setNotes(filteredNotes);
      console.log(data);
    } catch (er) {
      setError("Failed to fetch notes");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);
  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }

    setEditNote(null);
    setIsModalOpen(false);
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {error && <p className="text-rose-600 mb-6 bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">{error}</p>}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all transform hover:scale-110"
      >
        <span className="text-3xl font-bold"></span>
      </button>
      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold text-purple-800 mb-2">No notes yet!</h2>
          <p className="text-gray-600">Click the button to create your first note</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all transform hover:scale-105" key={note._id}>
              <h3 className="text-xl font-bold text-purple-800 mb-3">
                 {note.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{note.description}</p>
              <p className="text-sm text-purple-600 mb-4 font-medium">
                 {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(note)}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl hover:from-amber-500 hover:to-orange-500 font-semibold transition-all transform hover:scale-105 shadow-md"
                >
                   Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="flex-1 bg-gradient-to-r from-rose-400 to-pink-400 text-white px-4 py-2 rounded-xl hover:from-rose-500 hover:to-pink-500 font-semibold transition-all transform hover:scale-105 shadow-md"
                >
                   Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;