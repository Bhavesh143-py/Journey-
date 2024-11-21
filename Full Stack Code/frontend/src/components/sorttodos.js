export default function sortTodo(todos){
    const sortedTodos = [...todos].sort((a,b)=>{return a.task_timings.localeCompare(b.task_timings)})
    return sortedTodos;
}
