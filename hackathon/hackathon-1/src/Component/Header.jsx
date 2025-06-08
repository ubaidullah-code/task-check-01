import React, { useContext, useState } from 'react';
import { Link } from 'react-router'; // ✅ Correct import
import { GlobalContext } from '../Context/Context';
import { Menu, X, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'USER_LOGOUT' }); // ✅ Clear global state
      console.log('Sign-out successful');
    } catch (error) {
      console.error('Sign-out error', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EventHub
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            {state?.isLogin ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                  Dashboard
                </Link>

                {(state.isManager || state.isAdmin) && (
                  <Link to="/events" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                    Events
                  </Link>
                )}

                {state.isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {state.user.displayName || state.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-md text-gray-500 hover:text-blue-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/loginPage" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                  Sign in
                </Link>
                <Link
                  to="/signPage"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium rounded-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 space-y-1">
          {state?.isLogin ? (
            <>
              <Link to="/dashboard" className="block text-base text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              {(state.isAdmin || state.isManager) && (
                <Link to="/events" className="block text-base text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Events
                </Link>
              )}
              {state.isAdmin && (
                <Link to="/admin" className="block text-base text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-base text-gray-700 hover:text-blue-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/loginPage" className="block text-base text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
              <Link to="/signPage" className="block text-base text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
