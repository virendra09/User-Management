import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserDetail.css'; 

const UserDetail = () => {
    const { id } = useParams(); // Get the ID from the URL params
    const [user, setUser] = useState(null);
    console.log("this is id",id)

    useEffect(() => {
        // Fetch user details by ID
        axios
            .get(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((response) => {
                if (response.data) {
                    setUser(response.data);
                } else {
                    toast.error('User not found.');
                }
            })
            .catch(() => {
                toast.error('Failed to load user details. Please try again later.');
            });
    }, [id]);

    return user ? (
        <div className="user-detail-container">
            <h2>User Details</h2>
            <p><label>Name:</label> {user.name}</p>
            <p><label>Email:</label> {user.email}</p>
            <p><label>Phone:</label> {user.phone}</p>
            <p><label>Website:</label> <a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></p>
            <p><label>Address:</label> {user.address.street}, {user.address.city}</p>
            <p><label>Company:</label> {user.company.name}</p>
            <Link to="/" className="view-link">Back to Users List</Link>
            <ToastContainer /> {/* Include ToastContainer for toast notifications */}
        </div>
    ) : (
        <p>Loading user details...</p>
    );
};

export default UserDetail;
