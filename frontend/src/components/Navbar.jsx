import React, { useState, useRef } from "react";
import Button from "./Button";
import { authService } from "../client/src/services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser, setShowAuthCard } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Handle clicking outside to close dropdown
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowDropdown(false);
    };

    const handleSignInClick = () => {
        setShowAuthCard(true);
    };

    return (
        <nav className="border-b-2 border-b-gray-100 h-14 shadow-sm w-full flex items-center justify-between px-12 fixed top-0 bg-white z-10">
            <div className="text-indigo-600 font-bold text-base">MyBlog</div>
            
            {user ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-medium">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Button variant="primary_one" size="xs" onClick={handleSignInClick}>
                    Sign in
                </Button>
            )}
        </nav>
    )
}

export default Navbar;