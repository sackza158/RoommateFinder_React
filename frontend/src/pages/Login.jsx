import { useState } from "react";


function Login(){

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    function login(){
        fetch("http://localhost:5000/login",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.token){
                localStorage.setItem("token" , data.token);
                localStorage.setItem("userId" , data.userId)
                alert("Login Success");

                

                //เด้งไปหน้าHome
                window.location.href = "/";
            }
            else{
                alert("Wrong Password !!!");
            }
        });        
    }    

    return(
        <div>
            
            <h1>Login</h1>

            <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
            />

            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
            />

            <button onClick={login}>
                เข้าสู่ระบบ
            </button>

            
        </div>
    );

}

export default Login;