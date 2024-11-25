import { URL } from "../url";
 const remove_task=async (index,{token},onTaskRemoved)=>{
    const response =await fetch(`${URL}/api/tasks/removetask`,
    {
        method : "DELETE",
        headers : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({id : index}),
     }
    
)
if(response.ok){
    console.log("task removed successfully")
    onTaskRemoved();
}
else{
    console.log("error while removing the task");
}
 };
export default remove_task;