import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Edit, Trash, Plus, Users, Check, LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import FileUploader from '../Component/FileUploader';
import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GlobalContext } from '../Context/Context';

const EventManagerDashboard = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [managerEvents, setManagerEvents] = useState([]);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const db = getFirestore();
  
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    const realTimeData = () => {
      const q = query(collection(db, "events"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        let realTime = [];
        querySnapshot.forEach((doc) => {
          realTime.push({ ...doc.data(), id: doc.id });
        });
        const filteredEvents = realTime.filter(event => event.userId === state.user?.uid);
        setManagerEvents(filteredEvents);
      });
    };
    realTimeData();
    return () => {
      unsubscribe();
    };
  }, [state.user?.uid]);

  const handleFileData = (file) => {
    setUploadedFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

const handleCreateOrUpdateEvent = async (e) => {
  e.preventDefault();
  setShowModal(false);

  try {
    let imageUrl = uploadedFile;

    // Upload to Cloudinary if file is not already a URL
    if (uploadedFile && typeof uploadedFile !== 'string') {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("upload_preset", "social-posts");

      const res = await axios.post("https://api.cloudinary.com/v1_1/diplc3kki/upload", formData);
      imageUrl = res.data.url;
    }

    // Prepare event data
    const eventData = {
      manegerName: state.user.displayName,
      manegerprofilePic: state.user.photoURL,
      userEmail: state.user.email,
      userId: state.user.uid,
      title: eventForm.title,
      userDate: new Date().getTime(),
      postFile: imageUrl,
      status: 'Pending',
      eventLocation: eventForm.location,
      eventTime: eventForm.time,
      eventDescription: eventForm.description,
      eventDate: eventForm.date,
      registrations: 0,
      eventMadeBy: "event_manager"
    };

    if (isEditing && editingEventId) {
      // Update existing event
      await updateDoc(doc(db, "events", editingEventId), {
        ...eventData,
        eventId: editingEventId, // Save eventId during update
      });
    } else {
      // Create new event
      const docRef = await addDoc(collection(db, "events"), eventData);

      // Save eventId inside the document
      await updateDoc(docRef, {
        eventId: docRef.id
      });
    }

    // Clear form
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
    setUploadedFile(null);
    setIsEditing(false);
    setEditingEventId(null);

  } catch (err) {
    console.error("Error saving event:", err);
    alert("Failed to save event. Please try again.");
  }
};


  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleEditEvent = (event) => {
    setEventForm({
      title: event.title,
      date: event.eventDate,
      time: event.eventTime,
      location: event.eventLocation,
      description: event.eventDescription
    });
    setUploadedFile(event.postFile);
    setIsEditing(true);
    setEditingEventId(event.id);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-8">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-3xl font-bold mb-2">Event Manager Dashboard</h1>
          <p className="text-blue-100">Create and manage your events with ease.</p>
        </div>
      </div>

      {/* EVENT LIST + CREATE BUTTON */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Events</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>

        {managerEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">You haven't created any events yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img src={event.postFile} alt={event.title} className="w-full h-48 object-cover" />
                  <div className={`absolute top-0 right-0 px-3 py-1 m-2 rounded-md flex items-center ${
                    event.status === 'Approved'
                      ? 'bg-green-700 text-white'
                      : event.status === 'Pending'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {event.status === 'Approved' ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : event.status === 'Pending' ? (
                      <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    <span>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.eventDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.eventTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.eventLocation}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.registrations} Registrations</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button onClick={() => handleEditEvent(event)} className="flex items-center text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="flex items-center text-red-600 hover:text-red-800">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl z-10">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleCreateOrUpdateEvent}>
              {/* Inputs */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={eventForm.time}
                    onChange={handleInputChange}
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventForm.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={eventForm.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <FileUploader onFileSelect={handleFileData} existingFile={uploadedFile} />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditingEventId(null);
                    setUploadedFile(null);
                  }}
                  className="px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagerDashboard;
