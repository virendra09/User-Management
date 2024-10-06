import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ currentUser, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    address: { street: '', city: '' },
    company: { name: '' },
    website: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({ ...currentUser });
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && formData.name) {
      const formattedUsername = `USER-${formData.name.replace(/\s/g, '-').toLowerCase()}`;
      setFormData((prev) => ({ ...prev, username: formattedUsername }));
    }
  }, [formData.name, currentUser]);

  // Form Validation Logic
  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name is required and should be at least 3 characters long.';
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = 'Valid email is required.';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = 'Phone is required and should be a valid 10-digit number.';
    }

    if (!formData.address.street || !formData.address.city) {
      newErrors.address = 'Both street and city are required for the address.';
    }

    if (formData.company.name && formData.company.name.length < 3) {
      newErrors.company = 'Company name, if provided, should be at least 3 characters.';
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.website && !urlPattern.test(formData.website)) {
      newErrors.website = 'Website should be a valid URL format.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else if (name.includes('company.')) {
      const companyField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        company: { ...prev.company, [companyField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="user-form">
      <h2>{currentUser ? 'Update User' : 'Create User'}</h2>

      <div>
        <label>Name:</label>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Phone:</label>
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div>
        <label>Username (auto-generated):</label>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          readOnly
        />
      </div>

      <div>
        <label>Street:</label>
        <input
          name="address.street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>City:</label>
        <input
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div>
        <label>Company Name (Optional):</label>
        <input
          name="company.name"
          placeholder="Company Name"
          value={formData.company.name}
          onChange={handleChange}
        />
        {errors.company && <span className="error">{errors.company}</span>}
      </div>

      <div>
        <label>Website (Optional):</label>
        <input
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
        />
        {errors.website && <span className="error">{errors.website}</span>}
      </div>

      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default UserForm;
