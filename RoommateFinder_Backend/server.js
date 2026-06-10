const fs = require("fs");

const express = require("express");
console.log(__filename);


const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({
  limit: "10mb"
}));

//const rooms = [];

let rooms = [];

try{
  const data = fs.readFileSync("rooms.json" , "utf8");
  rooms = JSON.parse(data);
}

catch(error){
  console.log("โหลด room.json ไม่สำเร็จ")
}

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

app.post("/rooms" , (req, res) =>{
    const room = req.body;

    console.log("ได้รับข้อมูล",room);

    rooms.push(room);

    fs.writeFileSync(
      "rooms.json",
      JSON.stringify(rooms , null , 2)
    );

    res.json({
        message: "Room Added",
        room: room
    });

});

app.delete("/rooms/:id" , (req,res) => {
  const id = Number(req.params.id);

  console.log("ลบห้อง : " ,id);

  console.log("ก่อนลบ");
  console.log(rooms);


  rooms = rooms.filter(room => room.id !== id);

  fs.writeFileSync(
    "rooms.json",
    JSON.stringify(rooms , null , 2)
  );

  console.log("หลังลบ");
  console.log(rooms);

  res.json({
    message: "Delete Success"
  });

});


app.listen(5000, () => {
  console.log("Server Running");
});




