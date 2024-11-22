import { useNavigate } from "react-router-dom";
import Signup from "../components/Signupjs";
import { useState, useRef, useEffect } from "react";
import { useToken,useUsername } from "../components/tokencontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
// import { useAuth0 } from "@auth0/auth0-react";
import gsap from 'gsap';
import Without from "../components/WithOutACC";
// import ButtonAuth from "../components/GoogleAuth";
function SignupRender() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [mail, setMail] = useState("");
  const navigate2 = useNavigate();
  const [userdet, setuserdet] = useState();
  const { setToken } = useToken();
  const { setProUsername,setProPass } =useUsername();
  const gsapref = useRef();
  const headerref = useRef();
  const [header, setHeader] = useState("Journey");
  // const {isLoading, isAuthenticated, error } = useAuth0();

  function BreakTheText({ prop }) {
    return (
      <div>
        {prop.split("").map((char, index) => (
          <span className="inline-block" key={index}>{char}</span>
        ))}
      </div>
    );
  }
  async function handleprofile(event) {
    event.preventDefault(); // Prevent default form submission
    try {
      await Signup({ username, password }, navigate2, setToken, setProUsername,setProPass);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }

  useEffect(() => {
    console.log("Running animations...");
    if (headerref.current) {
      console.log("Animating header");
      gsap.from(headerref.current.querySelectorAll("span"), {
        y: -200,
        opacity: 0.5,
        duration: 0.8,
        delay: 0.5,
        stagger: 0.2,
      });
    }

    if (gsapref.current) {
      console.log("Animating form");
      gsap.from(gsapref.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.5,
      });
    }
  }, []);

  return (
    <div>
      <div>
        <h1 ref={headerref} className="mt-6 font-extrabold text-10xl text-center pt-6">
          <BreakTheText prop={header} />
        </h1>
      </div>
      <form ref={gsapref} onSubmit={handleprofile}>
        <div className="h-3/4 flex items-center justify-center">
          <div className="p-8 rounded-lg w-full max-w-md flex flex-col items-center m-4 border-gray-500 shadow-lg">
            <a href="/" className="flex items-center space-x-3 pb-3">
              <img src="src/assets/uphillll.svg" alt="journey" className="h-8" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">Journey</span>
            </a>
            <div className="w-full mb-4 flex items-center border rounded-xl">
              <FontAwesomeIcon icon={faUser} className="mx-2" />
              <input
                type="text"
                className="w-full px-4 py-2 border-none outline-none"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full mb-4 flex items-center border rounded-xl">
              <FontAwesomeIcon icon={faLock} className="mx-2" />
              <input
                type="password"
                className="w-full px-4 py-2 border-none outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full mb-4">
              <button
                type="submit"
                className="w-full px-4 py-2 text-center border rounded-xl"
              >
                Sign Up
              </button>
              <div className="w-full my-4">
                {/* <ButtonAuth /> */}
                <Without setProUsername={setProUsername} />
              </div>
            </div>
            <div className="w-full border-t p-2 text-center space-y-4">
              <a
                className="w-full px-4 py-2 hover:underline"
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
      <div className="w-2/3 mx-auto mt-14 flex items-center justify-center">
        <div className="box w-2/5 h-96 shadow-lg bg-slate-300 m-6"><img src="" alt="" /></div>
        <div className="box w-2/5 h-96 shadow-lg bg-slate-300 m-6"><img src="" alt="" /></div>
      </div>
    </div>
  );
}

export { SignupRender};
