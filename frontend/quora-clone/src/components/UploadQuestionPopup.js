import React, { useState } from 'react';
import axios from 'axios';

const UploadQuestionPopup = ({ isOpen, onClose, token }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to upload a question.');
      return;
    }

    if (title.length > 255) {
      setError('Title must not exceed 255 characters.');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/posts/questions/',
        { title, body: body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
      setTitle('');
      setBody('');
      setError('');
      window.location.reload();
    } catch (error) {
      setError('Error uploading question. Please try again.');
      console.error('Error uploading question:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Question Title (max 255 characters)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-500">{title.length}/255</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Question Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadQuestionPopup;