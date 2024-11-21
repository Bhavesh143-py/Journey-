const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const { createTODO, updateTodo} = require("../types");
const { Todo } = require("../db")
const { auth_middle } = require("../auth")

app.post("/todo", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const createpayload = req.body;
    const parsedpayload = createTODO.safeParse(createpayload);
    if (!parsedpayload.success) {
        res.status(403).json({
            msg: "you sent the wrong inputs",
        })
        return;
    }
    //put the todo in mongodb
    const newTODo = await Todo.create({
        title: createpayload.title,
        task_timings: createpayload.task_timings,
        user: userId
    })
    res.status(200).json({
        msg: "to do created",
        id: newTODo._id
    })
})

app.get("/home", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const todos = await Todo.find({ user: userId });
    res.status(200).json({
        todos
    })
})

app.put("/completed", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const updatePayload = req.body;
    const parsedpayload = updateTodo.safeParse(updatePayload);
    if (!parsedpayload.success) {
        res.status(403).json({
            msg: "You sent the wrong inputs ",

        })
        return;
    }
    const { id, day, completed } = req.body;
    try {

        const updatedTodo = await Todo.updateOne({ _id: id, user: userId }, { [day]: completed })
        res.status(200).json({
            msg: "TOdo marked as completed",
            todo: updatedTodo
        })
    } catch (err) {
        console.error("Error while creating/updating Task entry:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    };

});
app.put("/resettask",auth_middle, async (req,res)=>{
    const userId = req.user.id;
    try {
        const Reset_tasks = await Todo.updateMany({ user: userId }, {
            $set: {
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false,
            },
        })
        res.status(200).json({
            msg: "TOdo marked as completed",
            todo: Reset_tasks
            })
}catch(err){
    console.error("error while resetting :",err);
    res.status(500).json({msg:"internal Error"});
}
});

app.delete("/removetask", auth_middle, async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const Todo_remove = await Todo.deleteOne({ _id: id, user: userId })
    if (Todo_remove.deletedCount === 0) {
        res.status(403).json({
            msg: "task not found"
        })
        return;
    }
    res.status(200).json({
        msg: "task removed"
    })

})
module.exports = app;