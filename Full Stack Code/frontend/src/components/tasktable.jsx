
import remove_task from './removetask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { URL } from '../url';

export default function TaskTable({ todos = [], token, onTaskRemoved, setTaskUpdated }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle checkbox check/uncheck
  function handleCheck(day, id, completed) {
    fetch(`${URL}/api/tasks/completed`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Token passed as a prop
      },
      body: JSON.stringify({
        id: id,
        day: day,
        completed: completed, // Set based on checkbox state
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error('Error:', res.statusText);
        } else {
          setTaskUpdated(Date.now()); // Toggle task update state
          const json = await res.json(); // Use if needed
        }
      })
      .catch((err) => {
        console.error('There was a problem with the fetch operation:', err);
      });
  }

  return (
    <div className="overflow-x-auto m-2">
      <table className="w-5/6 table-auto border-collapse border border-gray-500 mx-auto shadow-lg dark:bg-gray-900 dark:text-white">
        <thead>
          <tr className="text-center text-base dark:bg-gray-800">
            <th className="p-4 border border-gray-300 dark:border-gray-700">Task No.</th>
            <th className="p-4 border border-gray-300 dark:border-gray-700">Time</th>
            <th className="p-4 border border-gray-300 dark:border-gray-700">Daily Tasks</th>
            {days.map((day) => (
              <th
                key={day}
                className="p-4 border border-gray-300 text-center dark:border-gray-700"
              >
                {day}
              </th>
            ))}
            <th className="p-4 border border-gray-300 text-center dark:border-gray-700">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="font-sans text-base dark:bg-gray-900 dark:text-white">
          {todos.map((todo, index) => (
            <tr key={todo._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="p-4 border border-gray-300 dark:border-gray-700">
                {index + 1}
              </td>
              <td className="p-4 border border-gray-300 whitespace-nowrap dark:border-gray-700">
                {todo.task_timings}
              </td>
              <td className="p-4 border border-gray-300 text-lg dark:border-gray-700">
                {todo.title}
              </td>
              {days.map((day, dayIndex) => (
                <td
                  key={`${todo._id}-${dayIndex}`}
                  className="p-4 border border-gray-300 text-center dark:border-gray-700"
                >
                  <input
                    type="checkbox"
                    id={`${todo._id}-${day}`}
                    name={`${day}-${todo._id}`}
                    defaultChecked={todo[day]}
                    onChange={(e) => handleCheck(day, todo._id, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-500 dark:text-blue-500"
                  />
                </td>
              ))}
              <td className="p-4 border border-gray-300 text-center dark:border-gray-700">
                <button
                  onClick={() => remove_task(todo._id, { token }, onTaskRemoved)}
                  className="text-red-500 hover:text-red-700 font-semibold mx-2 dark:text-red-400 dark:hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}
