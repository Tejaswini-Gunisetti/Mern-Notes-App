import React, { useEffect, useState } from "react";
import axios from "axios";

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      const payload = { title, description };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data);
      }
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (err) {
      console.log("Note save error");
      setError("Failed to save error");
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-purple-900 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          {note ? " Edit Note" : " Create Note"}
        </h2>
        {error && <p className="text-rose-600 mb-4 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" Note Title"
              className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=" Write your thoughts here..."
              className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all resize-none"
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              {note ? " Update" : " Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;