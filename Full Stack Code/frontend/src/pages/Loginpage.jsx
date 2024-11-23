import Login from "./login";
import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToken,useUsername } from "../components/tokencontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import NamePlate from "../components/NamePlate";


function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate2 = useNavigate();
  const { setToken } = useToken();
  const {setProUsername,setProPass} =useUsername();
  
  async function handlelogin(event) {
    event.preventDefault();
    try {
      await Login({ username, password }, navigate2, setToken, setProUsername, setProPass);
    } catch (error) {
      console.error("Error during signup:", error);
    }
    
  }

  return (
    <div>
      <NamePlate/>
    <div className="flex items-center justify-center">
      <div className="p-4 rounded-lg w-full max-w-md flex flex-col items-center border-gray-500 shadow-lg">
        <a href="/" className="flex items-center space-x-3 pb-3">
          <img src="src/assets/uphillll.svg" alt="journey" className="h-8" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Journey
          </span>
        </a>
        <form onSubmit={handlelogin} >
        <div className="w-full mb-4 flex items-center border rounded-xl">
          <FontAwesomeIcon icon={faUser} className="mx-2" />
          <input
            type="text"
            className="w-full px-4 py-2 border-none outline-none"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="w-full mb-4 flex items-center border rounded-xl">
          <FontAwesomeIcon icon={faLock} className="mx-2" />
          <input
            type="password"
            className="w-full px-4 py-2 border-none outline-none"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full mb-4">
          <button
            className="w-full px-4 py-2 text-center border rounded-xl"
            type="submit"
          >
            Login User
          </button>
        </div>

        <div className="w-full border-t p-2 text-center space-y-4">
          <a
            className="w-full px-4 py-2 hover:underline"
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
  );
}

const token = localStorage.getItem("authtoken");
export { LoginUser, token };
