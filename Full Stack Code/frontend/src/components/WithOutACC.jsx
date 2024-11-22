import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./Signupjs";
import { useToken,useUsername } from "./tokencontext";

export default function Without() {
    const { setToken } = useToken();
    const { setProUsername,setProPass } =useUsername();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // For loading feedback

    const handleProceed = async () => {
        setLoading(true);
        const username = `user_${Math.random().toString(36).substr(2, 9)}`;
        const password = "Password123"; // Temporary placeholder
        // const mail = `${username}@example.com`; // Temporary placeholder email

        try {
            await Signup({ username, password }, navigate, setToken,setProUsername,setProPass);
            // setProUsername(username);
            // console.log(username)
            // console.log("after setting",ProUsername)
        } catch (error) {
            console.error("Error during signup:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleProceed}
            disabled={loading}
            className={`w-full text-center border rounded-xl  px-4 py-2 ${loading ? "bg-gray-300" : "bg-blue-500"} text-white`}
        >
            {loading ? "Processing..." : "Proceed Without an Account"}
        </button>
    );
}
