import { useEffect, useState,useRef } from "react";
import { useToken,useEditor,useDarkMode } from "../components/tokencontext";
import axios from 'axios';
import { NavigateRoutes } from "../components/navig";
import MyEditor from "../components/TextEditor";
import DarkModeButton from "../components/DarkMode";
import { URL } from "../url";


function DatePickerComponent({ date, setDate }) {
  const datepickerRef = useRef(null);

  useEffect(() => {
    const initializeDatepicker = async () => {
      const { Datepicker } = await import('flowbite-datepicker');
      if (datepickerRef.current) {
        const datepicker = new Datepicker(datepickerRef.current, {
          autoselect: true,
          buttons: true,
          maxDate: new Date(),
        });

        // Attach event listener after initialization
        datepickerRef.current.addEventListener('changeDate', (event) => {
          const selectedDate = event.detail.date;
          const utcDate = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          ));
          const formattedDate = utcDate.toISOString().split('T')[0];
          setDate(formattedDate);
        });
      }
    };
    initializeDatepicker();
  }, []);

  const handleChange = (e) => {
    const newDate = e.target.value;
    console.log("New Date Selected:", newDate);
    setDate(newDate);
  };

  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </div>
      <input
        ref={datepickerRef}
        id="datepicker-actions"
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={new Date(date).toLocaleDateString("en-GB")}
        onChange={handleChange}
      />
    </div>
  );
}

function RenderJournal({ journal }) {
  if (!journal) return <p className="text-center font-semibold m-4 p-4">No journal data available for the selected date.</p>;
  return (
    <div className="relative w-1/2 mx-auto p-4 flex flex-wrap sm:flex-nowrap justify-between">
      <h1 className="text-lg font-semibold sm:mb-0 mb-2 w-full sm:w-auto text-center sm:text-left">
        Satisfaction: {journal.satisfaction_rate}/10
      </h1>
      <h1 className="text-lg font-semibold sm:mb-0 mb-2 w-full sm:w-auto text-center sm:text-left">
        Productivity: {journal.productivity_rate}/10
      </h1>
      <h1 className="text-lg font-semibold w-full sm:w-auto text-center sm:text-left">
        Date: {new Date(journal.Date).toLocaleDateString("en-GB")}
      </h1>
    </div>
  );
}
function Alljournals({ journalmonth, onjournalclick, hoveredDate, setHoveredDate,setEditorContent,setDate }) {
  if (!journalmonth || journalmonth.length === 0) {
    return <p>No journal entries available.</p>; // Display a message if there are no journals
  }

  return (
    <div className="relative flex flex-wrap justify-center mx-auto p-4">
      {journalmonth.map((journal, index) => {
        const averagescore = (journal.satisfaction_rate + journal.productivity_rate) / 2 || 0; // Default to 0 if undefined
        const buttoncolor = averagescore >= 7 ? 'bg-lime-500 hover:bg-green-700 focus:ring-green-600' :
          averagescore >= 4 ? 'bg-yellow-300 hover:bg-yellow-600 focus:ring-yellow-600' :
            'bg-red-500 hover:bg-red-700 focus:ring-red-600';

        return (
          <div key={index} className="relative inline-block m-2">
            <button data-tooltip-target="tooltip-dark" type="button" className= {`text-white ${buttoncolor} hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
              onMouseEnter={() => setHoveredDate(journal.Date)}
              onMouseLeave={() => setHoveredDate(null)} // Clear the date when hover leaves
              onClick={() => {onjournalclick(journal);
                setEditorContent(journal.journal_day);
                setDate(journal.Date.split('T')[0]); 

              }}
              aria-label={`Journal from ${new Date(journal.Date).toLocaleDateString()} with average score of ${averagescore.toFixed(2)}`}
            >
              {averagescore.toFixed(1)} {/* Showing average with two decimal places */}
            </button>

            {/* Tooltip that shows the journal date when hovered */}
            {hoveredDate === journal.Date && (
              <div
                id="tooltip-dark"
                className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-300 opacity-50"
                style={{ top: "-40px", left: "50%", transform: "translateX(-50%)" }}
              >
                {new Date(journal.Date).toLocaleDateString("en-GB")}  <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


function Journal() {
  const { token ,setToken} = useToken();
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  // const [journal, setJournal] = useState("");
  const [toggle,setToggle] =useState(true);
  const { editorContent,setEditorContent } = useEditor();
  const [date, setDate] = useState(today);
  const [month,setmonth]=useState(today);
  const [hoveredDate,setHoveredDate]=useState(null);
  const [satisfaction, setSatisfaction] = useState(5);
  const [productivity, setProductivity] = useState(5);
  const [fetchedJournal, setFetchedJournal] = useState(null); // Store the fetched journal data
  const [journalUpdated, setJournalUpdated] = useState(false);
  const [journalmonth,setjournalmonth] =useState(null);// storing the month full of journals
  const {darkMode} =useDarkMode();
  // Function to upload the journal entry to the backend
  const uploadJournal = () => {
    fetch(`${URL}/api/journal/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        satisfaction_rate: satisfaction,
        productivity_rate: productivity,
        Date: date,
        journal_day:editorContent ,
        
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Error:", res.statusText);
        } else {
          alert("Journal uploaded");
          setJournalUpdated(prop=>!prop);
          const json = await res.json(); // We will use this later if needed
        }
      })
      .catch((err) => {
        console.error("There was a problem with the fetch operation:", err);
      });
  };
  // Function to fetch the journal entry for the selected date
  useEffect(() => {
    if (token && typeof token === 'string') {
      const fetchJournal = async () => {
        try {
          const response = await axios.get(`${URL}/api/journal/getjournal`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            params: { Date: date }, // Pass the date as a query parameter
          });

          if (response.status === 200 && response.data.journalcomp.length > 0) {
            const journalContent = response.data.journalcomp[0].journal_day; // Assuming 'Journal' is the string you need
            setFetchedJournal(response.data.journalcomp[0]);
            setEditorContent(journalContent);
            setProductivity(response.data.journalcomp[0].productivity_rate);
            setSatisfaction(response.data.journalcomp[0].productivity_rate);
            setToggle(k => !k);
            
          } else {
            setFetchedJournal(null); // No journal entry found for the selected date
          }
        } catch (err) {
          console.error("Error while fetching the journal:", err);
        }
      };

      fetchJournal();
    } else {
      console.log("No valid token found");
    }
  }, [token, date, journalUpdated]);
 // Re-run the effect when `token` or `date` changes
  useEffect(()=>{
    if(token){
      const fetchmonthlyjournal = async ()=>{
        try{
          const responses = await axios.get(`${URL}/api/journal/getjournalmonthwise`,{
            headers :{
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            params: {Date: month},
          })
          if (Array.isArray(responses.data.journals) && responses.data.journals.length > 0) {
            setjournalmonth(responses.data.journals); // Set the first matching journal entry
          } else {
            setjournalmonth(null); // No journal entry found for the selected date
          }
        }catch(err) {
          console.error("Error while fetching the journal:", err);
        }
      };
      fetchmonthlyjournal();
    }else{
      console.log("No token found");
    }
  },[token,month,journalUpdated])

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <NavigateRoutes />
        <DarkModeButton/>
        <RenderJournal journal={fetchedJournal} />
        <MyEditor date={date} toggle={toggle}></MyEditor>

        {/* Journal Form */}
        <div className="relative w-1/2 mx-auto p-4 space-y-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
          {/* Satisfaction and Productivity Sliders */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Satisfaction */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="satisfaction"
                className="block text-center text-black dark:text-white"
              >
                Satisfaction: {satisfaction}
              </label>
              <input
                type="range"
                id="satisfaction"
                name="satisfaction"
                min="0"
                max="10"
                value={satisfaction}
                onChange={(e) => setSatisfaction(Number(e.target.value))}
                className="w-52"
              />
            </div>

            {/* Productivity */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="productivity"
                className="block text-center text-black dark:text-white"
              >
                Productivity: {productivity}
              </label>
              <input
                type="range"
                id="productivity"
                name="productivity"
                min="0"
                max="10"
                value={productivity}
                onChange={(e) => setProductivity(Number(e.target.value))}
                className="w-52"
              />
            </div>
          </div>

          {/* Centered Date Picker */}
          <div className="flex justify-center">
            <DatePickerComponent
              date={date}
              fetchedJournal={fetchedJournal}
              setDate={setDate}
              setEditorContent={setEditorContent}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={uploadJournal}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            >
              Save
            </button>
          </div>
        </div>

        {/* Previous Journals Section */}
        <h1 className="text-center font-semibold text-black dark:text-white mt-2 pt-2">
          Previous Journals
        </h1>
        <div className="flex justify-center items-center mx-auto w-full">
          <Alljournals
            journalmonth={journalmonth}
            onjournalclick={setFetchedJournal}
            hoveredDate={hoveredDate}
            setHoveredDate={setHoveredDate}
            setEditorContent={setEditorContent}
            setDate={setDate}
          />
        </div>
      </div>
    </div>
  );


}

export { Journal };
