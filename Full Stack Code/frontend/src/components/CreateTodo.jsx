import { useState } from "react";

export function CreateTodo({ addTodo, token }) {
    const [title, setTitle] = useState("");
    const [tasktimings, setTasktimings] = useState("");

    return (
        <div className="w-2/3 mx-auto  shadow-sm mt-4">
            <div className="flex justify-center items-center mx-auto py-4 ">
                {/* Title Input */}
                <div className="w-1/2 mx-auto flex justify-center">
                <form className="">
                    <label htmlFor="text"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Set Title:
                    </label>
                    <input
                        className=" p-2.5 w-full flex justify-center text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:bg-gray-900"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </form>
                </div>

                {/* Time Input */}
                <div className="flex justify-center w-1/2">
                <form className="max-w-[8rem] mx-auto ">
                    <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select time:</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input type="time" id="time" value={tasktimings} onChange={(e) => setTasktimings(e.target.value)} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900" min="09:00" max="18:00" required />
                    </div>
                </form>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-4 p-4 ">
                <button
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-sm px-10 py-2.5 text-center"
                    onClick={() => {
                        fetch("http://localhost:3000/api/tasks/todo", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                title: title,
                                task_timings: tasktimings,
                            }),
                        })
                            .then(async function (res) {
                                if (!res.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                const json = await res.json();
                                addTodo(json);
                                setTitle("");
                                setTasktimings("");
                            })
                            .catch((error) => {
                                console.error("There was a problem with the fetch operation:", error);
                            });
                    }}
                >
                    Save
                </button>
            </div>
        </div>


    );
}
