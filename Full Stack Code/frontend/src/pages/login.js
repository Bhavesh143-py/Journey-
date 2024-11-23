const Login = ({username,password},navigate2,setToken,setProUsername,setProPass)=>{
    fetch("http://localhost:3000/api/user/login",{
        method : "POST",
        headers:{ "Content-Type": "application/json",},
        body : JSON.stringify({
            username : username,
            password : password,
        })
    })
    .then(async  (res)=> {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        const data =await res.json();
        const token=data.id;
        alert(`${username} Logged in..!`);
        setProUsername(username);
        setProPass(password);
        setToken(token);
        // localStorage.setItem('authtoken',token);
        navigate2('/Journal');
         
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });
}
export default Login;