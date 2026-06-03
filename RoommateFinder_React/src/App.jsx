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

  //ทำทุกครั้งที่ Posts เปลี่ยน
  useEffect(() => {    
    if(posts.length > 0){
      console.log("บันทุึกโพสต์ :", posts)
      localStorage.setItem("posts" , JSON.stringify(posts)
      );
    }
  }, [posts])

  //ทำครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");

    console.log("โหลดข้อมูล :", savedPosts)
    if(savedPosts){
      setPosts(JSON.parse(savedPosts));
    }
  }, []);


  function addpost(){

    if(title === "" || price === "" || description === "" || roomtype === ""){
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
      roomtype : roomtype
    };

    if(editingId !== null){

      setPosts(
        posts.map(post => {
          if(post.id === editingId){
            return{
              ...post,
              title: title,
              price: price,
              description : description,
              roomtype : roomtype
            };
          }

          return post;
        })  
      );

      setEditingId(null);
      setTitle("");
      setPrice("");
      setDescription("");
      setRoomtype("");
      return;
  
    }

    setPosts([...posts, newPost]);
    setTitle("");
    setPrice("");
    setDescription("");
    setRoomtype("");
  }

  function deletePost(id){
    setPosts(
      posts.filter(post => post.id !== id)
    );
  }

  function editPost(post){
    setTitle(post.title);
    setPrice(post.price)
    setDescription(post.description);
    setEditingId(post.id);
    setRoomtype(post.roomtype);
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
          /> 
        ) ) }
    </div>
  );
}

export default App
