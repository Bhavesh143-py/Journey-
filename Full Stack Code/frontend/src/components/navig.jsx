import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUsername, useToken } from './tokencontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export function NavigateRoutes() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false); // State for profile popup
    const { setToken } = useToken();
    const { ProUsername,ProPass } = useUsername();
    // Function to determine if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-gray-300 bg-gray-100 relative z-[9999] dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo Section */}
                <a href="/" className="flex items-center space-x-3">
                    <img src="/assets/uphillll_rounded.png" alt="journey" className="h-8" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Journey
                    </span>
                </a>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>

                {/* Navigation Links */}
                <div
                    className={`${isMobileMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
                >
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-gray-100 dark:md:bg-gray-900">
                        {["/Journal", "/goals", "/DailyActions"].map((path, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => navigate(path)}
                                    className={`block py-2 px-3 rounded md:p-0 ${isActive(path)
                                            ? "text-blue-700 font-bold dark:text-blue-500"
                                            : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:md:hover:text-blue-500"
                                        }`}
                                >
                                    {path.slice(1)} {/* Extract and display the path name */}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => setProfileOpen(!isProfileOpen)} // Toggle popup
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:md:hover:text-blue-500 md:p-0"
                            >
                                Profile
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Profile Popup */}
            {isProfileOpen && (
                <div
                    className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-80 z-50 dark:bg-gray-900 dark:border-gray-700"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-semibold dark:text-white">{ProUsername}</h1>
                        <button
                            onClick={() =>
                                navigator.clipboard
                                    .writeText(ProUsername)
                                    .then(() => alert("Username copied to clipboard!"))
                                    .catch((err) => console.error("Could not copy username: ", err))
                            }
                            className="hover:text-blue-700 dark:hover:text-blue-500"
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="dark:text-white">{ProPass}</h1>
                        <button
                            onClick={() =>
                                navigator.clipboard
                                    .writeText(ProPass)
                                    .then(() => alert("Password copied to clipboard!"))
                                    .catch((err) => console.error("Could not copy password: ", err))
                            }
                            className="hover:text-blue-700 dark:hover:text-blue-500"
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                setToken(null);
                                setProfileOpen(false); // Close popup after logout
                                navigate("/");
                            }}
                            className="w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
                        >
                            Log Out
                        </button>
                        <button
                            onClick={() => setProfileOpen(false)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );

}
