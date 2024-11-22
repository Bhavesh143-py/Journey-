const Signup = async ({ username, password }, navigate, setToken,setProUsername,setProPass) => {
    try {
        const response = await fetch("http://localhost:3000/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            // Try to parse error message from server
            const errorData = await response.json();
            throw new Error(errorData.message || "Signup failed");
        }

        const data = await response.json();
        const token = data.id;

        if (!token) {
            throw new Error("No token received from server");
        }

        // Set token and navigate
        setToken(token);
        setProUsername(username);
        setProPass(password);
        
        navigate('/Journal');


        return token;
    } catch (error) {
        console.error("Signup error:", error);
        alert(error.message || "Failed to create user. Please try again.");
        throw error;
    }
};

export default Signup;