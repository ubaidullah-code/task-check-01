import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  query,
  arrayUnion, // For adding to user's registered events array
  increment,
  where, // For updating event registration count
  // setDoc, // Not used in the provided UserDashboard code
  // addDoc // Not used in the provided UserDashboard code
} from 'firebase/firestore';
import { GlobalContext } from '../Context/Context';
import RegisterModal from '../Component/RegisterModal'; // This imports the RegisterModal
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const { state } = useContext(GlobalContext);
  const db = getFirestore();

  const [allEvents, setAllEvents] = useState([]); // Stores all events from the 'events' collection
  const [userDetail, setUserDetail] = useState(null); // Stores the current logged-in user's document data
  
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null); // Event object for the "View Details" modal
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null); // Event object for the "Register" modal

  // --- Modal Control Functions ---
  const openDetailsModal = (event) => {
    setSelectedEventForDetails(event);
  };
  const closeDetailsModal = () => {
    setSelectedEventForDetails(null);
  };

  const openRegistrationModal = (event) => {
    // For static recommended events, they won't have an 'id' from Firestore.
    // The RegisterModal and handleRegistrationSubmit expect an event object with an 'id'.
    
    // If the event has an ID (meaning it's from Firestore), open the modal.
    if (event.id) {
        setSelectedEventForRegistration(event);
    } else {
        // This alert handles static/recommended events attempt to register.
        // alert("This is a sample event. Registration is not available for this item.");
         Swal.fire({
     title: "Sample Event",
     text: "This is a sample event. Registration is not available for this item.",
     icon: "question"
 });
    }
  };
  const closeRegistrationModal = () => {
    setSelectedEventForRegistration(null);
  };

  // --- Firestore Data Fetching Effect ---
  useEffect(() => {
    let unsubscribeEvents;
    let unsubscribeUser;

    // 1. Subscribe to all events
    const qEvents = query(collection(db, "events"),  where("status", "==", "Approved"));
    unsubscribeEvents = onSnapshot(qEvents, (querySnapshot) => {
      const realTimeEvents = querySnapshot.docs.map(docSnapshot => ({
        ...docSnapshot.data(),
        id: docSnapshot.id,
      }));
      setAllEvents(realTimeEvents);
    }, (error) => {
      console.error("Error fetching events:", error);
    });

    // 2. Subscribe to current user's document (if logged in)
    if (state.user?.uid) {
      const userDocRef = doc(db, "users", state.user.uid);
      unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserDetail({ ...docSnap.data(), id: docSnap.id }); // id here is the UID
        } else {
          console.warn("User document not found for UID:", state.user.uid);
          setUserDetail(null); 
        }
      }, (error) => {
        console.error("Error fetching user details:", error);
        setUserDetail(null);
      });
    } else {
      setUserDetail(null); 
    }

    return () => {
      if (unsubscribeEvents) unsubscribeEvents();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [db, state.user?.uid]); 

  const handleRegistrationSubmit = async (formDataFromModal) => {
    if (!selectedEventForRegistration || !state.user?.uid) {
      console.error("Error: No event selected for registration or user not logged in.");
      alert("Registration failed. Please try again."); 
      return;
    }

    const userDocRef = doc(db, 'users', state.user.uid);
    const eventDocRef = doc(db, 'events', selectedEventForRegistration.id);

    const registrationEntry = {
      eventId: selectedEventForRegistration.id,
      title: selectedEventForRegistration.title,
      eventDate: selectedEventForRegistration.eventDate,
      eventTime: selectedEventForRegistration.eventTime,
      eventLocation: selectedEventForRegistration.eventLocation,
      eventDescription: selectedEventForRegistration.eventDescription,
      postFile: selectedEventForRegistration.postFile,
      formData: formDataFromModal, 
      registeredAt: new Date().toISOString(), 
    };

    try {
     await updateDoc(userDocRef, {
        myRegistrations: arrayUnion(registrationEntry)
      }, { merge: true }); // {merge: true} is good practice for arrayUnion if the doc might not have the field yet.
                          // Though for arrayUnion, it's not strictly necessary if the doc exists.

      await updateDoc(eventDocRef, {
        registrations: increment(1)
      });

      console.log('Registration successful for event:', selectedEventForRegistration.title);
      // alert(`Successfully registered for ${selectedEventForRegistration.title}!`);
      Swal.fire({
  title: `Successfully registered for ${selectedEventForRegistration.title}!`,
  icon: "success",
  draggable: true
});
      closeRegistrationModal(); 
    } catch (error) {
      console.error('Error processing registration:', error);
      // alert(`Registration failed: ${error.message}. Please try again.`); 
      Swal.fire({
  title: `Registration failed: ${error.message}. Please try again.`,
  icon: "success",
  draggable: true
});
    }
  };

  const myRegisteredEvents = userDetail?.myRegistrations || [];
  const registeredEventIds = new Set(myRegisteredEvents.map(reg => reg.eventId));
  const availableEventsToDisplay = allEvents.filter(event => !registeredEventIds.has(event.id));

  // --- Static Recommended Events Data (as from your original code) ---
  const recommendedEventsData = [
    {
      title: "Design Workshop",
      eventDate: "2025-06-10",
      eventTime: "10:00 AM - 03:00 PM",
      eventLocation: "Creative Studio, San Francisco",
      postFile: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Workshop",
      eventDescription: "A hands-on workshop focusing on modern design principles and tools. Suitable for beginners and intermediate designers." // Added example description
    },
    {
      title: "Summer Music Festival",
      eventDate: "2025-07-15",
      eventTime: "06:00 PM - 11:00 PM",
      eventLocation: "Central Park, New York",
      postFile: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Concert",
      eventDescription: "Enjoy a vibrant evening of live music from various artists spanning multiple genres. Food trucks and activities available." // Added example description
    },
    {
      title: "Startup Networking",
      eventDate: "2025-08-05",
      eventTime: "07:00 PM - 10:00 PM",
      eventLocation: "Innovation Hub, Austin",
      postFile: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Startup Meetup",
      eventDescription: "Connect with fellow entrepreneurs, investors, and tech enthusiasts. Share ideas and build your network." // Added example description
    }
  ];
//   const showAlert = () => {
//   Swal.fire({
//     title: "The Internet?",
//     text: "That thing is still around?",
//     icon: "question"
//   });
// };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {userDetail?.name || state.user?.displayName || 'Event Enthusiast'}!
          </h1>
          <p className="text-blue-100">Discover and manage your upcoming events.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section: Your Registered Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Your Registered Events</h2>
          {myRegisteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">You haven't registered for any events yet.</p>
              <button 
                onClick={() => document.getElementById('discover-events-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRegisteredEvents.map((registeredEventItem) => (
                <div key={registeredEventItem.eventId} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
                  <img
                    src={registeredEventItem.postFile || 'https://via.placeholder.com/400x300'}
                    alt={registeredEventItem.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{registeredEventItem.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{new Date(registeredEventItem.eventDate).toLocaleDateString()}</span> {/* Assuming eventDate is a string that can be parsed by Date */}
                    </div>
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{registeredEventItem.eventTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4 text-sm">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{registeredEventItem.eventLocation}</span>
                    </div>
                    <button
                      onClick={() => openDetailsModal(registeredEventItem)}
                      className="w-full text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out border border-blue-600 py-2 rounded-md hover:bg-blue-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Discover More Events */}
        <div className="mb-10" id="discover-events-section">
          <h2 className="text-2xl font-bold mb-6">Discover More Events</h2>
          {allEvents.length === 0 && !state.user?.uid && ( 
             <div className="bg-white rounded-lg shadow-md p-8 text-center">
               <p className="text-gray-600">Loading events or no events are currently available. Please check back later!</p>
             </div>
          )}
          {allEvents.length > 0 && availableEventsToDisplay.length === 0 && state.user?.uid && ( 
             <div className="bg-white rounded-lg shadow-md p-8 text-center">
               <p className="text-gray-600">Looks like you've registered for all available events!</p>
             </div>
          )}
          {availableEventsToDisplay.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEventsToDisplay.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
                  <img
                    src={event.postFile || 'https://via.placeholder.com/400x300'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col"> {/* Added flex flex-col */}
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span> {/* Assuming eventDate can be parsed */}
                    </div>
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.eventTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4 text-sm">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.eventLocation}</span>
                    </div>
                    <div className="mt-auto pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2"> {/* mt-auto pushes this to bottom */}
                      <button
                        onClick={() => openDetailsModal(event)}
                        className="flex-1 text-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out border border-blue-600 py-2 px-3 rounded-md hover:bg-blue-50 text-sm"
                      >
                        View Details
                      </button>
                      {state.user ? (
                        <button
                          onClick={() => openRegistrationModal(event)}
                          className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out text-sm"
                        >
                          Register
                        </button>
                      ) : (
                         <p className="flex-1 text-sm text-gray-500 text-center py-2">Login to register</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Recommended Events (Static) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Recommended Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEventsData.map((event, index) => (
              <div key={`recommended-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
                <img 
                  src={event.postFile} 
                  alt={event.alt} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col"> {/* Added flex flex-col */}
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2 text-sm"> {/* Matched styling */}
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span> {/* Assuming eventDate can be parsed */}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2 text-sm"> {/* Matched styling */}
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.eventTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4 text-sm"> {/* Matched styling */}
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.eventLocation}</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2">
                    <button
                      onClick={() => openDetailsModal(event)} // Can view details for static ones too
                      className="flex-1 text-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out border border-blue-600 py-2 px-3 rounded-md hover:bg-blue-50 text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => openRegistrationModal(event)} // Will show an alert for static events because no event.id
                      className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out text-sm"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div> {/* End of max-w-7xl mx-auto */}

      {/* View Details Modal Implementation */}
      {selectedEventForDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-xl m-4">
            <button
              onClick={closeDetailsModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={selectedEventForDetails.postFile || 'https://via.placeholder.com/400x300'}
              alt={selectedEventForDetails.title}
              className="w-full h-56 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold mb-3 text-gray-800">{selectedEventForDetails.title}</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed">{selectedEventForDetails.eventDescription || 'No specific description provided for this event.'}</p>
            
            <div className="space-y-2 text-gray-600 text-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2.5 text-blue-500 flex-shrink-0" />
                <span>{new Date(selectedEventForDetails.eventDate).toLocaleDateString()}</span> {/* Assuming eventDate can be parsed */}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2.5 text-blue-500 flex-shrink-0" />
                <span>{selectedEventForDetails.eventTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2.5 text-blue-500 flex-shrink-0" />
                <span>{selectedEventForDetails.eventLocation}</span>
              </div>
            </div>

            {selectedEventForDetails.formData && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Your Registration Details:</h4>
                {Object.entries(selectedEventForDetails.formData).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-600">
                    <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>{String(value)}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={closeDetailsModal}
              className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Registration Modal (uses the RegisterModal component) */}
      {selectedEventForRegistration && selectedEventForRegistration.id && ( // Only show if it's a registerable event (has an id)
        <RegisterModal
          event={selectedEventForRegistration}
          isOpen={!!selectedEventForRegistration} 
          onClose={closeRegistrationModal} 
          onSubmit={handleRegistrationSubmit} 
        />
      )}
    </div>
  );
};

export default UserDashboard;