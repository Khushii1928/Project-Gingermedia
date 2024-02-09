import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = ({ user, setLoginUser }) => {
  const [profileData, setProfileData] = useState({
    age: '',
    dob: '',
    contact: '',
  });

  const [updatedDetails, setUpdatedDetails] = useState(null);

  useEffect(() => {
    if (user) {
      const storedUpdatedProfile = JSON.parse(localStorage.getItem('updatedProfile')) || {};

      setProfileData({
        age: storedUpdatedProfile.age || user.age || '',
        dob: storedUpdatedProfile.dob || user.dob || '',
        contact: storedUpdatedProfile.contact || user.contact || '',
      });

      setUpdatedDetails(storedUpdatedProfile);
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    setProfileData({
      age: profileData.age,
      dob: profileData.dob,
      contact: profileData.contact,
    });

    
    localStorage.setItem('updatedProfile', JSON.stringify(profileData));
    setUpdatedDetails(profileData);

    console.log('User details updated successfully!');
  };

  const handleLogout = () => {
    setLoginUser({});
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://media.istockphoto.com/id/1331335633/vector/female-avatar-icon.jpg?s=612x612&w=0&k=20&c=2wtNjpPMjZqxpbDTuowyu2D2fHit6uMeESMfZOkCSKQ=" alt="Profile Icon" />
        <h2>Update Your Profile</h2>
      </div>
      {user ? (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              Age:
              <input
                type="text"
                name="age"
                value={profileData.age}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Date of Birth:
              <input
                type="text"
                name="dob"
                value={profileData.dob}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Contact:
              <input
                type="text"
                name="contact"
                value={profileData.contact}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Update Profile</button>
          </form>
          {updatedDetails && (
            <div className="updated-details">
              <p>Updated Age: {updatedDetails.age}</p>
              <p>Updated Date of Birth: {updatedDetails.dob}</p>
              <p>Updated Contact: {updatedDetails.contact}</p>
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
