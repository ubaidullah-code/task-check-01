// File: ../Component/RegisterModal.js
import React, { useContext } from 'react';
import { GlobalContext } from '../Context/Context';

const RegisterModal = ({ isOpen, onClose, onSubmit, event }) => {
  if (!isOpen || !event) return null;
  
  const { state } = useContext(GlobalContext);

  // This object is used to pre-fill the form display values
  // It's re-created on each render if isOpen and event are true.
  const displayFormData = {
      name : state.user?.displayName || '', // Added optional chaining for safety
      email : state.user?.email || ''     // Added optional chaining for safety
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This formData is what gets submitted
    const submittedFormData = {
      name: e.target.name.value, // Reads value from the (disabled) input field
      email: e.target.email.value, // Reads value from the (disabled) input field
      phone: e.target.phone.value, // Reads value from the phone input field
    };
    onSubmit(submittedFormData);
    onClose(); // Closes the modal after submission attempt
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close modal"
        >
          {/* Using an SVG for consistency with other modals, but ✖ is also fine */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Register for: <span className="text-blue-600">{event.title}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={displayFormData.name} // Pre-filled from context
              disabled // User cannot change this
              className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={displayFormData.email} // Pre-filled from context
              disabled // User cannot change this
              className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="e.g., (555) 123-4567"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Confirm Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;