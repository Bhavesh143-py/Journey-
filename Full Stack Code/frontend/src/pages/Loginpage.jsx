import Login from "./login";
import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToken,useUsername,useDarkMode } from "../components/tokencontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import NamePlate from "../components/NamePlate";
import DarkModeButton from "../components/DarkMode";


function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate2 = useNavigate();
  const { setToken } = useToken();
  const {setProUsername,setProPass} =useUsername();
  const { darkMode } =useDarkMode();
  const [loading, setLoading] = useState(false);
  async function handlelogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Login({ username, password }, navigate2, setToken, setProUsername, setProPass);
    } catch (error) {
      console.error("Error during signup:", error);
    }finally{
      setLoading(false);
    }
    
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <DarkModeButton />
        <NamePlate />
        <div className="flex items-center justify-center">
          <div className="p-4 rounded-lg w-full max-w-md flex flex-col items-center border border-gray-300 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <a href="/" className="flex items-center space-x-3 pb-3">
              <img src="\assets\uphillll_rounded.png" alt="journey" className="h-8" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Journey
              </span>
            </a>
            <form onSubmit={handlelogin}>
              <div className="w-full mb-4 flex items-center border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <FontAwesomeIcon icon={faUser} className="mx-2 text-gray-500 dark:text-gray-300" />
                <input
                  type="text"
                  className="w-full px-4 py-2 border-none outline-none bg-transparent text-black dark:text-white"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="w-full mb-4 flex items-center border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <FontAwesomeIcon icon={faLock} className="mx-2 text-gray-500 dark:text-gray-300" />
                <input
                  type="password"
                  className="w-full px-4 py-2 border-none outline-none bg-transparent text-black dark:text-white"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-full mb-4">
                <button
                  className="w-full px-4 py-2 text-center border rounded-xl border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  type="submit"
                >
                  {loading ? "Processing..." : "Login"}
                </button>
              </div>

              <div className="w-full border-t border-gray-300 dark:border-gray-700 p-2 text-center space-y-4">
                <a
                  className="w-full px-4 py-2 hover:underline text-gray-500 dark:text-gray-300"
                  onClick={() => {
                    navigate2("/");
                  }}
                >
                  New User
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

const token = localStorage.getItem("authtoken");
export { LoginUser, token };
