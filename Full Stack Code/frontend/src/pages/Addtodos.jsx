import { useState, useEffect,useReducer } from "react";
import sortTodo from "../components/sorttodos";
import { CreateTodo } from "../components/CreateTodo";
import TaskTable from "../components/tasktable";
import axios from 'axios';
// import { useNavigate } from "react-router-dom";
import { useToken,useDarkMode } from "../components/tokencontext";
import { NavigateRoutes } from "../components/navig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import DarkModeButton from "../components/DarkMode";
import { URL } from "../url";

export default function AddTodos() {
  const {token}=useToken();
  const {darkMode} =useDarkMode();
  const [todos, setTodos] = useState([]);
  const [taskUpdated, setTaskUpdated] = useState(Date.now());
  const navigate = useNavigate();
  const [reset,setReset] =useState(false);
  

  const ResetChecks =async ()=>{
    if(token){
      try{
        const response = await axios.put(`${URL}/api/tasks/resettask`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
          }
        );
        //  window.location.reload("/Journal");
        setReset(prev => !prev);
      } catch (err) { console.log("error:", err); }
    } 
  }
  

  useEffect(() => {
    if (token) {
      const fetchTodos = async () => {
        try {
          const response = await axios.get(`${URL}/api/tasks/home`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const sortedTodos = sortTodo(response.data.todos);
          setTodos(sortedTodos);
        } catch (err) {
          console.log("error:", err);
        }
      };
      fetchTodos();
    } else {
      console.log("no token found");
    }
  }, [token, taskUpdated,reset]);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
    setTaskUpdated(Date.now());
  };

  const handleTaskRemoved = () => {
    setTaskUpdated(Date.now());
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavigateRoutes />
      <DarkModeButton/>
      {/* Center the div horizontally */}
      <div className="m-4 w-2/3 mx-auto flex justify-end items-center">
        {/* Align the button to the end of the div */}
        <button
          className="flex items-center px-8 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm py-2.5 me-2 mb-2"
          onClick={ResetChecks}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
      <TaskTable todos={todos} token={token} onTaskRemoved={handleTaskRemoved} setTaskUpdated={setTaskUpdated} />
      <CreateTodo addTodo={addTodo} token={token} />
      </div>
    </div>
  );

}
