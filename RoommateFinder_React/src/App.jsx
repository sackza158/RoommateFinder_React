import { useState, useEffect } from "react";
import PostItem from "./PostItem";

function App() {

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [roomtype, setRoomtype] = useState("")
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [image , setImage] = useState("");
  const [selectedPost,setSelectedPost] = useState(null);

  // //ทำทุกครั้งที่ Posts เปลี่ยน
  // useEffect(() => {    
  //   if(posts.length > 0){
  //     console.log("บันทุึกโพสต์ :", posts)
  //     localStorage.setItem("posts" , JSON.stringify(posts)
  //     );
  //   }
  // }, [posts])

  // //ทำครั้งเดียวตอนเปิดหน้า
  // useEffect(() => {
  //   const savedPosts = localStorage.getItem("posts");

  //   console.log("โหลดข้อมูล :", savedPosts)
  //   if(savedPosts){
  //     setPosts(JSON.parse(savedPosts));
  //   }
  // }, []);

  useEffect(() =>{
    
    fetch("http://localhost:5000/rooms")
    .then(response => response.json())
    .then(data => {
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
      id: Date.now(),
      title: title,
      price: price,
      description : description,
      roomtype : roomtype,
      image : image
    };

    if(editingId !== null){

      const updatePost = {
        id: editingId,
        title: title,
        price: price,
        description: description,
        roomtype: roomtype,
        image: image
      };

      fetch(`http://localhost:5000/rooms/${editingId}`,{
        method: "PUT",
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(updatePost)
      })
      .then(response => response.json())
      .then(data => {

        console.log(data);

        setPosts(
          posts.map(post =>{
            if(post.id === editingId){
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
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });


    setPosts([...posts, newPost]);
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
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      //filter เพราะต้องลบโพสที่แสดงอยู่หน้าบ้านด้วย
      setPosts(posts.filter(post => post.id !== id));
    })
  }

  function editPost(post){
    setTitle(post.title);
    setPrice(post.price)
    setDescription(post.description);
    setEditingId(post.id);
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

  return(
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
            key={post.id}
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
  );
}

export default App
