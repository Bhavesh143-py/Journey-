const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const { setGoal } = require("../types");
const {  Goal } = require("../db")
const {  auth_middle } = require("../auth")

app.post("/creategoal", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const { startdate, enddate, title, description } = req.body;
    const parsed_goal = setGoal.safeParse(req.body);

    if (!parsed_goal.success) {
        return res.status(403).json({ msg: "Invalid inputs" });
    }

    try {
        const creategoal = await Goal.create({
            user: userId,
            title: title,
            startdate: startdate,
            enddate: enddate,
            description: description,
        });

        res.status(200).json({
            msg: "Goal Created",
            goal: creategoal, // Returning the full goal
        });
    } catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.put("/updategoal", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const { startdate, enddate, title, description, id } = req.body;
    const parsed_goal = setGoal.safeParse(req.body);

    if (!parsed_goal.success) {
        return res.status(403).json({ msg: "Invalid inputs" });
    }

    try {
        const goal_update = await Goal.findOneAndUpdate(
            { user: userId, _id: id },
            {
                $set: {
                    title: title,
                    description: description,
                    startdate: startdate,
                    enddate: enddate,
                },
            },
            { new: true } // Ensures the updated goal is returned
        );

        if (!goal_update) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        res.status(200).json({
            msg: "Goal updated",
            goal: goal_update,
        });
    } catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.get("/getgoals", auth_middle, async (req, res) => {
    const userId = req.user.id;

    try {
        const goals = await Goal.find({ user: userId });

        if (!goals || goals.length === 0) {
            return res.status(200).json({ msg: "No goals found" });
        }

        res.status(200).json({ goals });
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});
app.delete("/deletegoal", auth_middle, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.body;
    try {
        const removegoal = await Goal.deleteOne({ _id: id, user: userId })
        if (removegoal.deletedCount === 0) {
            res.status(403).json({
                msg: "task not found"
            })
            return;
        }
        res.status(200).json({
            msg: "task removed"
        })
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
})
module.exports = app;