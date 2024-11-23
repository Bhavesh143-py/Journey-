const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MongoDB_link)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,    
    },
}, { timestamps: true })
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 0,
        max: 50,
        trim: true,
    },
    task_timings: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    Monday: {
        type: Boolean,
        required: false,
        default: false
    },
    Tuesday: {
        type: Boolean,
        required: false,
        default: false
    },
    Wednesday: {
        type: Boolean,
        required: false,
        default: false
    },
    Thursday: {
        type: Boolean,
        required: false,
        default: false
    },
    Friday: {
        type: Boolean,
        required: false,
        default: false
    },
    Saturday: {
        type: Boolean,
        required: false,
        default: false
    },
    Sunday: {
        type: Boolean,
        required: false,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' collection
        required: true,
    },
}, { timestamps: true })
const JournalSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: Date.now,
        required: true
    },
    satisfaction_rate: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    productivity_rate: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    journal_day: {
        type: String,
        min: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' collection
        required: true,
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' collection
        required: true,
    },
    startdate: {
        type: Date,
        default: Date.now,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
const User = mongoose.model("user", userSchema)
const Todo = mongoose.model("todos", todoSchema);
const Journal = mongoose.model("journal", JournalSchema);
const Goal = mongoose.model("goal", goalSchema)
module.exports = {
    Todo, Journal, User, Goal
}