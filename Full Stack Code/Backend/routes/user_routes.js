const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
const {  userLogin, UserSignup } = require("../types");
const { User } = require("../db")
const { JWT_secret} = require("../auth")

app.post("/signup", async (req, res) => {
    const createUser = req.body;
    const parsedUser = UserSignup.safeParse(createUser);
    if (!parsedUser.success) {
        res.status(403).json({
            msg: "you sent the wrong inputs",

        })
        return;
    }
    const newUser = await User.create({
        username: createUser.username,
        email: createUser.email,
        password: createUser.password,
    })
    const logintoken = jwt.sign({ id: newUser._id }, JWT_secret);
    res.status(200).json({
        msg: "new user created..!",

        id: logintoken
    })
})
app.post("/login", async (req, res) => {
    const createlogin = req.body;
    const parselogin = userLogin.safeParse(createlogin);
    if (!parselogin.success) {
        res.status(403).json({
            msg: "you sent the wrong inputs",

        })
        return;
    }
    const creds = await User.findOne({ username: createlogin.username, password: createlogin.password });
    if (!creds) {
        res.status(403).json({
            msg: "User not found..!"
        })
        return;
    }
    const logintoken = jwt.sign({ id: creds._id }, JWT_secret);
    res.status(200).json({
        msg: "user login successful",
        id: logintoken,
    })
})
module.exports = app;