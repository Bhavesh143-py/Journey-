const jwt =require("jsonwebtoken");
const JWT_secret = import.meta.env.VITE_APP_AUTH0_JWT_secret;
const auth_middle=(req,res,next)=>{
    const auth_header=req.headers["authorization"] || req.headers["Authorization"];
    const token =auth_header && auth_header.split(" ")[1];
    if(!token){
        return res.status(401).json({
            msg : "Token not provided..!",
        })
    }
    jwt.verify(token, JWT_secret, (err, user) => {
        if (err) return res.status(401).json({ msg: "Invalid credentials" });
        req.user = user; // Assign decoded JWT payload to req.user
        next();
    });
    
    
}
module.exports={
    JWT_secret,auth_middle
}