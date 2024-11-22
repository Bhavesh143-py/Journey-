const zod = require("zod");
const UserSignup=zod.object({
    username:zod.string().min(1),
    password: zod.string().min(8),

})
const userLogin=zod.object({
    username:zod.string().min(1).optional(),
    password: zod.string().min(8).optional(),

})
const createTODO= zod.object({
    title: zod.string().min(1,"TItle is required").max(50),
    task_timings: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Expected HH:MM"),
    user : zod.string().optional()
})
const updateTodo = zod.object({
    id: zod.string().min(1, "Task ID is required"), // Ensure that 'id' is a string
    day: zod.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "Invalid day"),
    completed: zod.boolean(),
    title: zod.string().min(1, "Title is required").max(50).optional(),
    task_timings: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Expected HH:MM").optional(),
    Monday: zod.boolean().optional(),
    Tuesday: zod.boolean().optional(),
    Wednesday: zod.boolean().optional(),
    Thursday: zod.boolean().optional(),
    Friday: zod.boolean().optional(),
    Saturday: zod.boolean().optional(),
    Sunday: zod.boolean().optional(),
});

const createJournal = zod.object({
    Date: zod.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, zod.date().optional()),
    satisfaction_rate: zod.number().max(10).min(0),
    productivity_rate: zod.number().max(10).min(0),
    journal_day: zod.string(),
    user: zod.string().optional(),
    active : zod.boolean().optional()
  });
const updateJournal = zod.object({
    satisfaction_rate: zod.number().max(10).min(0).optional(),
    productivity_rate: zod.number().max(10).min(0).optional(),
    journal_day : zod.string().optional(),
    active : zod.boolean().optional()

})
const setGoal = zod.object({
    startdate: zod.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      }, zod.date()),
    enddate : zod.preprocess((arg)=>{
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },zod.date()),
    title: zod.string().min(1),
    description : zod.string().optional()
})
module.exports ={
    UserSignup : UserSignup,
    userLogin : userLogin,
    createTODO :createTODO,
    updateTodo : updateTodo,
    createJournal :createJournal,
    updateJournal : updateJournal,
    setGoal : setGoal
}