import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load profile. Please try again.');
        setLoading(false);
        console.error('Profile fetch error:', error);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!profile) return <div className="text-center py-10">No profile data available.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
          <div className="space-y-4">
          <p className="text-gray-700"><strong>First Name:</strong> {profile.msg.first_name}</p>
          <p className="text-gray-700"><strong>Last Name:</strong> {profile.msg.last_name}</p>
          <p className="text-gray-700"><strong>Username:</strong> {profile.msg.username}</p>
          <p className="text-gray-700"><strong>Email:</strong> {profile.msg.email}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {profile.msg.phone}</p>
            {/* Add more fields as per your backend response */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;