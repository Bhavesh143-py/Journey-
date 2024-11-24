import { useEffect, useState } from "react";
import { useToken,useDarkMode } from "../components/tokencontext";
import { NavigateRoutes } from "../components/navig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import HeatMapComponent from "./heatmap";
import DarkModeButton from "../components/DarkMode";
import { Datepicker } from "flowbite-react";

export function Goals() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goals, setGoals] = useState([]);
    const [goalsUpdated, setGoalsUpdated] = useState(false);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const { token, setToken } = useToken();
    const { darkMode } =useDarkMode();
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editedGoal, setEditedGoal] = useState(null);
    const formatDateForInput = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Get date part in yyyy-mm-dd format
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB"); // "en-GB" formats as dd-mm-yyyy
    };
    // To handle entering edit mode
    const  handleEditClick = (goal) => {
        setEditingGoalId(goal._id);
        setEditedGoal(goal);
    };

    // To handle input changes for the editing form
    const handleInputChange = (e, goalId) => {
    const { name, value } = e.target;
    setEditedGoal((prevEditedGoal) => ({
        ...prevEditedGoal,
        [name]: value,
    }));
};

    // Function to save the edited goal
    const handleSaveClick = (goalId) => {
        // Update the goals list locally
        setGoals((prevGoals) =>
            prevGoals.map((goal) => (goal._id === editingGoalId ? editedGoal : goal))
        );
        uploadGoal(goalId);  // Save the edited goal to the backend
        setEditingGoalId(null);  // Exit edit mode
    };

    const handleCancelClick = () => {
        setEditingGoalId(null);
    };
    const handleDelete=(goalId)=>{
        fetch("http://localhost:3000/api/goals/deletegoal",{
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: goalId
                 // Spread the contents of editedGoal (title, description, startdate, enddate)
            }),

        }).then(async(res)=>{
            if (!res.ok) {
                console.error("Error:", res.statusText);}
            else{
                setGoalsUpdated(prev => !prev);
            }
        }) .catch((err) => {
            console.error("There was a problem with the fetch operation:", err);
        });

    }

    // Upload the edited goal to the backend (PUT request)
    const uploadGoal = (goalId) => {
        fetch("http://localhost:3000/api/goals/updategoal", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: goalId,
                ...editedGoal, // Spread the contents of editedGoal (title, description, startdate, enddate)
            }), // Send the edited goal data
        })
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Error:", res.statusText);
                } else {
                    alert("Goal Updated");
                    const updatedGoal = await res.json();
                    setGoals((prevGoals) =>
                        prevGoals.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
                    );
                    setGoalsUpdated(prev => !prev);  // Re-fetch or refresh the goals
                }
            })
            .catch((err) => {
                console.error("There was a problem with the fetch operation:", err);
            });
    };

    // Upload new goal (POST request)
    const uploadNewGoal = () => {
        fetch("http://localhost:3000/api/goals/creategoal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                startdate: startDate,
                enddate: endDate
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Error:", res.statusText);
                } else {
                    alert("Goal Set");
                    const json = await res.json();
                    addGoal(json.goal);
                }
            })
            .catch((err) => {
                console.error("There was a problem with the fetch operation:", err);
            });
    };

    const addGoal = (newGoal) => {
        setGoals([...goals, newGoal]);
        setGoalsUpdated(prev => !prev);
    };

    useEffect(() => {
        if (token) {
            const fetchGoals = async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/goals/getgoals", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await response.json();
                    if (data.goals && data.goals.length > 0) {
                        setGoals(data.goals);
                    } else {
                        setGoals([]);
                    }
                } catch (err) {
                    console.error("Error while fetching goals:", err);
                }
            };
            fetchGoals();
        } else {
            console.log("No token found");
        }
    }, [token, goalsUpdated]);
    if(setGoals.length === 0){
        return(
            <p className="text-center font-semibold">Try To set some Goals</p>
        )
    }
    function Component() {
        return <Datepicker title="Flowbite Datepicker" />
    }

    return (
        <div className={`${darkMode ? "dark" : ""}`} >
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
            <NavigateRoutes/>
            <DarkModeButton/>
            {goals.length === 0 && (
                <div className="text-center my-4">
                    <p className="text-lg font-medium">Try setting some Goal</p>
                </div>
            )}

            <div>
        {goals.map((goal) => (
            <div key={goal._id} className=" shadow-md  mx-auto w-3/5 my-4 border dark:shadow-sm dark:shadow-white">
                {editingGoalId === goal._id ? (
                <div className="mx-auto w-2/3 dark:">
                    <div className="flex justify-between pt-4">
                        <div>
                        <label htmlFor="startdate" className="block text-left">Start :</label>
                            <Datepicker
                                title="Goal Set:"
                                selected={editedGoal.startdate ? new Date(editedGoal.startdate) : null} // Convert to Date object
                                onChange={(date) => {
                                 // Handle change to update the state
                                const event = { target: { name: "startdate", value: date } };
                                handleInputChange(event, goal._id);
                                }}
                                name="startdate"
                                id="startdate"
                                className="p-2"
                                />
                        </div>
                        <div>
                        <label htmlFor="enddate" className="block text-left">End :</label>
                                <Datepicker
                                    title="Goal End:"
                                    selected={editedGoal.enddate ? new Date(editedGoal.enddate) : null} // Converts string to Date object
                                    onChange={(date) => {
                                        // Handle date selection
                                        const event = { target: { name: "enddate", value: date } }; // Convert date to ISO format
                                        handleInputChange(event, goal._id);
                                    }}
                                    name="enddate"
                                    id="enddate"
                                    className="p-2" // Styling similar to input
                                />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center" >
                        <div className="m-4 w-full">
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={editedGoal.title}
                        onChange={(e) => handleInputChange(e, goal._id)}
                            className="w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
                    />
                        </div>
                        <div className="m-4 w-full">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={editedGoal.description}
                        onChange={(e) => handleInputChange(e, goal._id)}
                                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-900 dark:text-white"
                    />
                        </div>
                    </div>
                    <div className="flex justify-center m-4 space-x-4">
                    <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" 
                    onClick={() => handleSaveClick(goal._id)}>Save</button>
                    <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={handleCancelClick}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="mx-auto w-2/3">
                    <div className="flex justify-between pt-4">
                            <p className="font-semibold">Start Date: {formatDate(goal.startdate)}</p>
                            <p className="font-semibold">End Date: {formatDate(goal.enddate)}</p>
                    </div>
                    <div className="">
                    <h1 className="text-3xl font-bold pt-4">#{goal.title}</h1>
                    <h2 className="text-lg font-semibold p-2">@{goal.description}</h2>
                    </div>
                            <div className="border-gray-600 shadow-md dark:shadow-sm dark:shadow-white dark:border-gray-200" >
                    <HeatMapComponent startdate={goal.startdate} enddate={goal.enddate} />
                    </div>
                    <div className="py-4 flex justify-center">
                        <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => handleEditClick(goal)}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => handleDelete(goal._id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                </div>
            )}
        </div>
    ))}
</div>
            <div className="border-gray-900 mx-auto w-3/5 mt-6 py-6 flex justify-center">
                {/* Conditional Form Section */}
                {showGoalForm && (
                    <div className="mx-auto w-2/3 ">
                        <div className="flex justify-between">
                            <div>
                                <label htmlFor="startDate" className="block  mb-2 text-sm font-medium text-gray-900 dark:text-white">Start :</label>
                                    <Datepicker
                                        title="Goal Set:"
                                        className="p-2" 
                                        selected={startDate ? new Date(startDate) : null} 
                                        onChange={(date) => setStartDate(date)}  
                                        id="startDate" 
                                        name="StartDate" 
                                    />
                            </div>
                            <div>
                                    <label htmlFor="endDate" className="block  mb-2 text-sm font-medium text-gray-900 dark:text-white">End :</label>
                                    <Datepicker
                                        title="Goal End:"
                                        className="p-2"
                                        selected={endDate ? new Date(endDate) : null}
                                        onChange={(date) => setEndDate(date)}
                                        id="startDate"
                                        name="StartDate"
                                    />
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <div className="m-4 w-full">
                                <label htmlFor="title" className="block  mb-2 text-sm font-medium text-gray-900 dark:text-white">Goal Title :</label>
                        <input
                            className="w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
                            id="title"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                            </div>
                            <div className="m-4 w-full">
                                <label htmlFor="description" className="block  mb-2 text-sm font-medium text-gray-900 dark:text-white">Goal Description :</label>
                        <input
                                        className="w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
                            type="text"
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                                onClick={uploadNewGoal}
                            >
                                Upload Goal
                            </button>
                            <button
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                                onClick={() => {
                                    setShowGoalForm(!showGoalForm);
                                    // setCancle((prev) => !prev);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Button */}
                {!showGoalForm && (
                    <button
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        onClick={() => {
                            setShowGoalForm(!showGoalForm);
                            // setCancle((prev) => !prev);
                        }}
                    >
                        Add New Goal
                    </button>
                )}
            </div>
            </div>
        </div>
    );
}
