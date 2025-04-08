import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UploadQuestionPopup from './UploadQuestionPopup';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">Quora Clone</div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setShowUploadPopup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                disabled={!isLoggedIn}
              >
                Upload Question
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-600 hover:text-gray-800 text-2xl"
                >
                  ⋮
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>
              <UploadQuestionPopup
                isOpen={showUploadPopup}
                onClose={() => setShowUploadPopup(false)}
                token={token}
              />
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                disabled
              >
                Upload Question
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;