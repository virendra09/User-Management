import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserForm from './components/UserForm';
import Modal from './components/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Loader from './components/Loader'; 

const App = () => {
  const [users, setUsers] = useState([]); // State to hold list of users
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [currentUser, setCurrentUser] = useState(null); // Track user being edited
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // Store user ID for deletion
  const [searchTerm, setSearchTerm] = useState(''); // Track search input value
  // Load users from local storage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  // Fetch users data from API on component mount
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch users. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Handle Create or Update user submission
  const handleCreateOrUpdate = (user) => {
    if (currentUser) {
        // Update existing user
        axios
            .put(`https://jsonplaceholder.typicode.com/users/${currentUser.id}`, user)
            .then((response) => {
                setUsers(users.map((value) => (value.id === currentUser.id ? response.data : value)));
                setCurrentUser(null);
                toast.success('User updated successfully!');
            })
            .catch((error) => {
                console.error("Update error:", error);
                toast.error('Failed to update user. Please try again.');
            });
    } else {
        // Create a new user
        axios
            .post('https://jsonplaceholder.typicode.com/users', user)
            .then((response) => {
                console.log("Create response:", response.data);

                // Create a user object using the response
                const newUser = {
                    id: users.length + 1, // Create a temporary ID (or you can use any logic)
                    ...user // Spread the user object to include all properties
                };
                const updatedUsers = [...users, newUser];
                setUsers(updatedUsers); // Add new user to the state
                
                // Store users in local storage
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                // setUsers([...users, newUser]); // Add new user to the state
                toast.success('User created successfully!');
            })
            .catch((error) => {
                console.error("Creation error:", error);
                toast.error('Failed to create user. Please try again.');
            });
    }
    setShowForm(false); // Close the form after submission
};





  // Handle user deletion
  const handleDelete = () => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${userToDelete}`)
      .then(() => {
        setUsers(users.filter((value) => value.id !== userToDelete));
        setShowModal(false);
        setUserToDelete(null);
        toast.success('User deleted successfully!');
      })
      .catch(() => {
        toast.error('Failed to delete user. Please try again.');
        setShowModal(false);
      });
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  // Filter the users based on the search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>User Management</h1>
      <button onClick={() => setShowForm(true)}>Create User</button>

      {/* Search Input for Filtering Users */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Show the form when creating or updating a user */}
      {showForm && (
        <UserForm
          currentUser={currentUser}
          onSave={handleCreateOrUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Display loader while fetching data */}
      {loading ? (
        <Loader />
      ) : (
        // Render users in a table format
        <table className="user-table">
          <thead >
            <tr id="user-table_thead-tr">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Actions">
                  <div className="button-group">
                    <button onClick={() => { setCurrentUser(user); setShowForm(true); }}>Edit</button>
                    <button className="delete-btn" onClick={() => confirmDelete(user.id)}>Delete</button>
                    <Link className="view-link" to={`/users/${user.id}`}>View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      )}

      {/* Show confirmation modal when deleting */}
      {showModal && (
        <Modal
          title="Confirm Delete"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
};

export default App;
