import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from './QuestionCard';
import Header from './Header';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/posts/questions/');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Questions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;