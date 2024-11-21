import { useAuth0 } from "@auth0/auth0-react"
import Signup from "./Signupjs";
import { useNavigate } from "react-router-dom";
import { useToken } from "./tokencontext";
import { useEffect, useState } from "react";

const ButtonAuth = () => {
    const { setToken } = useToken();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const [isProcessing, setIsProcessing] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log("Auth state:", {
            isLoading,
            isAuthenticated,
            user
        });
    }, [isLoading, isAuthenticated, user]);

    // Handle user registration after successful Auth0 authentication
    useEffect(() => {
        const registerUser = async () => {
            // Prevent multiple registrations or processing
            if (!isAuthenticated || !user || isProcessing) return;

            try {
                setIsProcessing(true);
                console.log("Processing user:", user);

                // Generate a robust username
                const userName = user.given_name ||
                    user.nickname ||
                    user.email.split('@')[0] ||
                    `user_${Math.random().toString(36).substr(2, 9)}`;

                const userPassword = `auth0|${user.sub}`; // Unique password for Auth0 users
                const userMail = user.email;

                console.log("Attempting signup with:", { userName, userMail });

                // Call signup function with generated credentials
                await Signup(
                    {
                        username: userName,
                        password: userPassword,
                        mail: userMail
                    },
                    navigate,
                    setToken
                );
            } catch (error) {
                console.error("Signup error:", error);
                alert("Failed to complete signup. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        };

        // Trigger registration when authenticated
        if (isAuthenticated && user) {
            registerUser();
        }
    }, [isAuthenticated, user, isProcessing]);

    // Handle Google login
    const handleAuth = async () => {
        try {
            setIsProcessing(true);
            await loginWithRedirect();
        } catch (error) {
            console.error("Login error:", error);
            alert("Failed to initiate login. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <button
            className={`w-full px-4 py-2 text-center border rounded-xl 
                        ${isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={handleAuth}
            disabled={isProcessing}
        >
            {isProcessing ? 'Processing...' : 'Continue with Google'}
        </button>
    );
};

export default ButtonAuth;