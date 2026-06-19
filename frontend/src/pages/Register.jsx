import { useState } from "react";


function Register(){

    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    function register(){
        fetch("http://localhost:5000/register",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
        })
        .then(response => response.json())
        .then(data => {
        console.log(data);
        alert ("Register Success");
        //เด้งไปหน้าHome
        window.location.href = "/";
        });        
    }    
    
    return(
        <div>
            <h1>Register</h1>
            <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
            />

            <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
            />

            <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
            />

            <button onClick={register}>
                สมัครสมาชิก
            </button>

            
        </div>
    );

}

export default Register;