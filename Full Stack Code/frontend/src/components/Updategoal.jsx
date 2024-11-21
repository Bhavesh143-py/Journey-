import { useEffect, useState } from "react";
function HandleEdit({goal}){
    const [goalId,setGoalId]=useState(goal._id);
    const [editedTitle, setEditedTitle] = useState(goal.title);
    const [editedDescription, setEditedDescription] = useState(goal.description);
    const [editedStartDate, setEditedStartDate] = useState(goal.startdate);
    const [editedEndDate, setEditedEndDate] = useState(goal.enddate);
    const handleSaveClick = (goalId) => {
        
      };
    
};