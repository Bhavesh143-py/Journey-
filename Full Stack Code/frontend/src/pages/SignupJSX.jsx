import { useNavigate } from "react-router-dom";
import Signup from "../components/Signupjs";
import { useState, useRef, useEffect } from "react";
import { useToken,useUsername,useDarkMode } from "../components/tokencontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Without from "../components/WithOutACC";
import SlidingLogos from "../components/SliiderNotes";
import NamePlate from "../components/NamePlate";
import TextAnime from "../components/TextOnScroll";
import Footerpage from "../components/Footer";
import DarkModeButton from "../components/DarkMode";

function SignupRender() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate2 = useNavigate();
  const { setToken } = useToken();
  const { setProUsername,setProPass } =useUsername();
  const { darkMode } = useDarkMode();
  const gsapref = useRef();
  gsap.registerPlugin(useGSAP);
  async function handleprofile(event) {
    event.preventDefault(); // Prevent default form submission
    try {
      await Signup({ username, password }, navigate2, setToken, setProUsername,setProPass);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }

  useGSAP(
    () => {
      gsap.from(gsapref.current, {
        scale: 0,
        delay: 0.5,
        duration: 1,
      })
    }
  )

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <DarkModeButton />
        <NamePlate />
        <form ref={gsapref} onSubmit={handleprofile}>
          <div className="h-3/4 flex items-center justify-center">
            <div className="p-8 rounded-lg w-full max-w-md flex flex-col items-center m-4 border border-gray-300 dark:border-gray-700 shadow-lg">
              <a href="/" className="flex items-center space-x-3 pb-3">
                <img src="\src\assets\uphillll_rounded.png" alt="journey" className="h-8" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap">
                  Journey
                </span>
              </a>
              <div className="w-full mb-4 flex items-center border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <FontAwesomeIcon icon={faUser} className="mx-2 text-gray-500 dark:text-gray-300" />
                <input
                  type="text"
                  className="w-full px-4 py-2 border-none outline-none bg-transparent text-black dark:text-white"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="w-full mb-4 flex items-center border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <FontAwesomeIcon icon={faLock} className="mx-2 text-gray-500 dark:text-gray-300" />
                <input
                  type="password"
                  className="w-full px-4 py-2 border-none outline-none bg-transparent text-black dark:text-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-full mb-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-center border rounded-xl border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Sign Up
                </button>
                <div className="w-full my-4">
                  <Without />
                </div>
              </div>
              <div className="w-full border-t border-gray-300 dark:border-gray-700 p-2 text-center space-y-4">
                <a
                  className="w-full px-4 py-2 hover:underline text-gray-500 dark:text-gray-300"
                  onClick={() => {
                    navigate2('/login');
                  }}
                >
                  Already a User
                </a>
              </div>
            </div>
          </div>
        </form>
        <TextAnime />
        <SlidingLogos />
        <Footerpage />
      </div>
    </div>
  );

}

export { SignupRender};
