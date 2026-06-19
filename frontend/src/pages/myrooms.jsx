import { useEffect, useState } from "react";
import PostItem from "../PostItem";
import{
  Link
} from "react-router-dom";

function Myrooms(){
    const [posts, setPosts] = useState([]);
    const [isLogin , setIsLogin] = useState(false);

    useEffect(() =>{
        fetch("http://localhost:5000/rooms" , {
            headers: {
                Authorization : `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => 
                setPosts(data));
    }, []);

    function logout(){
        localStorage.removeItem(
        "token"
        );
        localStorage.removeItem(
        "userId"
        );    

        setIsLogin(false);
        //เด้งไปหน้าHome
        window.location.href = "/";

        alert("ออกจากระบบแล้ว !")
    }

    return(
        <div>
            <nav className="navbar">
                <div className="navbar-logo">🏠 Roommate Finder</div>
                    <div className="navbar-links">
                    {
                    isLogin
                    ?
                    <>
                        <Link to="/myrooms">
                        <button className="btn-login">ดูห้องของฉัน</button>
                        </Link>
                    
                        <button onClick={logout} className="btn-logout">
                        Logout
                        </button>
                    </>
                    : (
                        <>
                        <Link to="/login">
                            <button className="btn-login">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-register">Register</button>
                        </Link>
                        </>
                    )
                    }
                </div>
            </nav>


            <div className="container">
                 <h1>
                    "โพสต์ของฉัน"
                </h1>
                {posts.map(post => (
                    <PostItem
                    key={post._id}
                    post={post}
                    /> 
                ))} 
            </div>
       </div>
    );
}

export default Myrooms;