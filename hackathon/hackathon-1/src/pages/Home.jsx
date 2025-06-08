import React from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  // Featured events
  const featuredEvents = [
    {
      id: '1',
      title: 'Tech Conference 2025',
      date: 'April 15-17, 2025',
      location: 'Convention Center, New York',
      attendees: 500,
      image: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '2',
      title: 'Networking Mixer',
      date: 'May 20, 2025',
      location: 'Downtown Plaza Hotel, Chicago',
      attendees: 150,
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '3',
      title: 'Design Workshop',
      date: 'June 10, 2025',
      location: 'Creative Studio, San Francisco',
      attendees: 75,
      image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Event background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover, Create & Manage <span className="text-blue-400">Amazing Events</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              The complete platform for event creators and attendees. Create memorable experiences and connect with your audience.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition duration-300 ease-in-out transform hover:scale-105">
                Get Started
              </Link>
              
              <Link to="/events" className="bg-transparent border-2 border-white text-white font-medium rounded-md px-6 py-3 hover:bg-white hover:text-blue-900 transition duration-300 ease-in-out">
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{event.attendees}+ attending</span>
                  </div>
                  <Link to={`/events/${event.id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-150 ease-in-out">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/events" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-150 ease-in-out text-lg">
              View All Events
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EventHub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to create, manage, and attend events with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Event Creation</h3>
              <p className="text-gray-600">
                Create and customize events with ease. Set dates, locations, and manage registrations all in one place.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Attendee Management</h3>
              <p className="text-gray-600">
                Track registrations, communicate with attendees, and manage capacity with our powerful tools.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">
                Get detailed analytics on attendance, engagement, and more to help optimize your events.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your own event?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event creators who trust EventHub for their event management needs.
          </p>
          <Link to="/signPage" className="bg-white text-blue-600 hover:bg-gray-100 font-bold rounded-md px-8 py-3 transition duration-300 ease-in-out inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;