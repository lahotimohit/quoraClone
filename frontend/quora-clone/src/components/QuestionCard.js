// src/components/QuestionCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionCard = ({ question, isLoggedIn }) => {
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [images, setImages] = useState([]); // Handle multiple images
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAnswers();
  }, [question.id]); // Re-fetch when question.id changes

  const fetchAnswers = async () => {
    try {
      const authHeader = token ? `Bearer ${token.trim()}` : '';
      console.log('Fetch Answers Authorization Header:', authHeader); // Debug header
      const response = await axios.get(`http://127.0.0.1:8000/posts/questions/${question.id}/answers/`, {
        headers: { Authorization: authHeader },
      });
      setAnswers(response.data);
    } catch (error) {
      console.error('Error fetching answers:', error.response?.data || error.message);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !token) {
      console.error('Not logged in or token missing:', { isLoggedIn, token });
      return;
    }

    const formData = new FormData();
    formData.append('question', question.id);
    formData.append('body', newAnswer);
    images.forEach((image, index) => {
      formData.append('uploaded_images', image); // Ensure multiple images are appended
    });

    const authHeader = `Bearer ${token}`;
    console.log('Submit Authorization Header:', authHeader); // Debug header
    console.log('FormData entries:', Array.from(formData.entries())); // Debug FormData

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/posts/answers/',
        formData,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'multipart/form-data', // Explicitly set Content-Type for FormData
          },
        }
      );
      console.log('Answer posted successfully:', response.data);
      setNewAnswer('');
      setImages([]);
      fetchAnswers();
    } catch (error) {
      console.error('Error posting answer:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headersSent: authHeader,
      });
    }
  };

  const handleLike = async (answerId) => {
    if (!isLoggedIn) return;

    try {
      const authHeader = `Bearer ${token ? token.trim() : ''}`;
      console.log('Like Authorization Header:', authHeader); // Debug header
      await axios.post(
        `http://127.0.0.1:8000/posts/like-answer/${answerId}/like/`,
        {},
        { headers: { Authorization: authHeader } }
      );
      fetchAnswers();
    } catch (error) {
      console.error('Error liking answer:', error.response?.data || error.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    // if (files.length > 0) {
    //   // Filter to ensure only image files are accepted
    //   const imageFiles = files.filter(file => file.type.startsWith('image/'));
    //   if (imageFiles.length !== files.length) {
    //     console.warn('Non-image files were ignored. Only images are allowed.');
    //   }
    //   setImages(imageFiles); // Update images state with selected image files
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800">{question.title}</h3>
      <p className="text-gray-600 mt-2">{question.body}</p>
      <div className="space-y-6">
        {answers.map((answer) => {
          const { first_name, last_name, email } = answer.user;
          const avatarText = `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
          const createdAt = new Date(answer.created_at).toLocaleString(); // Format timestamp

          return (
            <div key={answer.id} className="flex space-x-4 border-t pt-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                  {avatarText}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-md font-medium text-gray-800">Posted By: {first_name} {last_name}</h4>
                <p className="text-sm text-gray-500">{email}</p>
                <p className="text-gray-700 mt-2">{answer.body}</p>
                {answer.images && answer.images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {answer.images.map((imgObj, index) => (
                    <img
                      key={index}
                      src={`https://res.cloudinary.com/dvjg6st2t/${imgObj.image}`}
                      alt={`Answer image ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md shadow"
                    />
                  ))}
                </div>
              )}

                <div className="flex items-center mt-2 space-x-4">
                  <button
                    onClick={() => handleLike(answer.id)}
                    className={`flex items-center px-3 py-1 rounded-md transition duration-300 ${
                      answer.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                    disabled={!isLoggedIn}
                  >
                    <span className="text-xl">❤️</span>
                    <span className="ml-1">{answer.likes_count || 0}</span>
                  </button>
                  <p className="text-xs text-gray-400">{createdAt}</p>
                </div>
                {isLoggedIn && answer.is_owner && (
                  <div className="space-x-2 mt-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isLoggedIn && (
        <form onSubmit={handleAnswerSubmit} className="mt-4 space-y-4">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
          disabled={!isLoggedIn}
        />
        <div>
          <label className="block text-gray-700 mb-1">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            disabled={!isLoggedIn}
          />
        </div>
        {isLoggedIn && (
          <button
            type="submit"
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Submit Answer
          </button>
        )}
      </form>
      )}
    </div>
  );
};

export default QuestionCard;