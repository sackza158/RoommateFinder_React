import{
  Link
} from "react-router-dom";

import { useState, useEffect } from "react";
import PostItem from "../PostItem";
import "./Home.css";

function Home() {

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [roomtype, setRoomtype] = useState("")
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [image , setImage] = useState("");
  const [selectedPost,setSelectedPost] = useState(null);
  const [isLogin , setIsLogin] = useState(false);

  //CheckLogin
  useEffect(() =>{

    const token = localStorage.getItem("token");

    if(token){
      setIsLogin(true);
    }
  } , []);

  //LoadData
  useEffect(() =>{
    
    fetch("http://localhost:5000/rooms")
    .then(response => response.json())
    .then(data => {

      console.log(data);
      
      setPosts(data);
    });

  }, []);

  function handleImageChange(event){
    const file = event.target.files[0];

    if(!file){
      return;
    }

    const reader = new FileReader();

    reader.onload = () =>{
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }


  function addpost(){

    if(title === "" || price === "" || description === "" || roomtype === "" || image === ""){
      return;
    }

    if(isNaN(price)){
      alert("ราคาต้องเป็นตัวเลข")
      setPrice("");
      return;
    }

    const newPost ={
      //id: Date.now(),
      title: title,
      price: price,
      description : description,
      roomtype : roomtype,
      image : image
    };

    if(editingId !== null){

      const updatePost = {
        _id: editingId,
        title: title,
        price: price,
        description: description,
        roomtype: roomtype,
        image: image
      };

      fetch(`http://localhost:5000/rooms/${editingId}`,{
        method: "PUT",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatePost)
      })
      .then(response => {
        if(!response.ok){
          if(response == 401){
            alert("กรุณาเข้าสู่ระบบก่อนแก้ไข !")
          }
          else{
            alert("เกิดข้อผิดพลาดในการแก้ไข !")
          }

          throw Error("Request failed with status  + response.status");
        }

        return response.json()
      })
      .then(data => {

        console.log(data);

        setPosts(
          posts.map(post =>{
            if(post._id === editingId){
              return updatePost;
            }
            
            return post;
          })
        );
      })

      setEditingId(null);
      setTitle("");
      setPrice("");
      setDescription("");
      setRoomtype("");
      setImage("");

      return;

    }

    console.log("กำลังส่ง" , newPost );

    fetch("http://localhost:5000/rooms",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Authorization : `Berrer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(newPost)
    })
    .then(response => {
      if(!response.ok){
        if(response.status === 401){
          alert("กรุณาเข้าสู่ระบบก่อนโพสต์!");
        }else{
          alert("เกิดข้อผิดพลาดในการโพสต์!")
        }

        throw new Error("Request failed with status " + response.status);
      }
      
      return  response.json();
    })
    .then(data => {
      console.log(data);
      setPosts([...posts, data.room]);
    });

    setTitle("");
    setPrice("");
    setDescription("");
    setRoomtype("");
    setImage("");
  }

  // function deletePost(id){
  //   setPosts(
  //     posts.filter(post => post.id !== id)
  //   );
  // }

  function deletePost(id){

    fetch(`http://localhost:5000/rooms/${id}` , {
      method: "DELETE",

      headers:{
        Authorization : `Bearer : ${localStorage.getItem("token")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      //filter เพราะต้องลบโพสที่แสดงอยู่หน้าบ้านด้วย
      setPosts(posts.filter(post => post._id !== id));
    })
  }

  function editPost(post){
    setTitle(post.title);
    setPrice(post.price)
    setDescription(post.description);
    setEditingId(post._id);
    setRoomtype(post.roomtype);
    setImage(post.image);
  }

  function sortPriceLower(){
    setPosts(
      [...posts].sort(
        (a, b) => Number(a.price) - Number(b.price)
      )
    );
  }
  function sortPriceHigher(){
    setPosts(
      [...posts].sort(
        (a, b) => Number(b.price) - Number(a.price)
      )
    );
  }

  function logout(){
    localStorage.removeItem(
      "token"
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
        <div classNmae="navbar-links">
          {
          isLogin
          ?
          (<button onClick={logout} className="btn-logout">
            Logout
          </button>)
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
          {posts.length === 0 ? "ยังไม่มีโพสต์" : "จำนวนโพสต์ทั้งหมด " + posts.length + " รายการ"  }
        </h1>
        <input
          value={title} 
          onChange={(event) => setTitle(event.target.value)}
          placeholder="ชื่อหอพัก"
        />
        <input
          value={price} 
          onChange={(event) => setPrice(event.target.value)}
          placeholder="ราคา"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="รายระเอียด"
        />

        <select
          value={roomtype}
          onChange={(event) => setRoomtype(event.target.value)}
        >
        <option value="">เลือกประเภทห้อง</option>
        <option value="หอพักรวม">หอพักรวม</option>
        <option value="หอพักชาย">หอพักชาย</option>
        <option value="หอพักหญิง">หอพักหญิง</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button onClick={addpost}>
          {editingId === null ? "เพิ่มโพสต์" : "บันทึกแก้ไข"}
        </button>

        <button onClick={sortPriceLower}>
          เรียงราคา จากต่ำไปสูง
        </button>

        <button onClick={sortPriceHigher}>
          เรียงราคา จากสูงไปต่ำ
        </button>
      


        <input
          value={search} 
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาหอพัก"
        />



        {posts
          .filter(post => 
            post.title
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            post.roomtype
              .toLowerCase()
              .includes(search.toLowerCase())       
          )

          .map(post => (
            <PostItem
              key={post._id}
              post={post}
              onEdit={editPost}
              onDelete={deletePost}
              onView={setSelectedPost}
            /> 
          ) ) }

          {selectedPost && (
            <div className="modal-overlay">

              <div className="modal">
                
                {selectedPost.image && (
                  <img 
                    src={selectedPost.image}
                    alt="room"
                    className="room-image"
                  />
                )}

                <h2>{selectedPost.title}</h2>
                <p>{selectedPost.price} บาท/เดือน</p>
                <p>{selectedPost.roomtype}</p>
                <p>{selectedPost.description}</p>

                <button onClick={() => setSelectedPost(null)}>
                  ปิด
                </button>

              </div>

            </div>

          )}

      </div>
    </div>
  );
}

export default Home;
