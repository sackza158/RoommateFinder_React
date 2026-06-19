
const jwt = require("jsonwebtoken");
const SECRET_KEY = "roommatefinder_secret";

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const Room = require("./models/Room")
const User = require("./models/User");


const express = require("express");
console.log(__filename);


const cors = require("cors");
const app = express();

mongoose.connect(
  "mongodb://sackza158_db_user:Test123456@ac-b0rbp6w-shard-00-00.yuxpir9.mongodb.net:27017,ac-b0rbp6w-shard-00-01.yuxpir9.mongodb.net:27017,ac-b0rbp6w-shard-00-02.yuxpir9.mongodb.net:27017/roommatefinder?ssl=true&replicaSet=atlas-3wrzh7-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.error(err);
});
app.use(cors());
app.use(express.json({
  limit: "10mb"
}));


// let rooms = [];

// try{
//   const data = fs.readFileSync("rooms.json" , "utf8");
//   rooms = JSON.parse(data);
// }

// catch(error){
//   console.log("โหลด room.json ไม่สำเร็จ")
// }


function verifyToken(req , res , next){
    console.log(req.headers);

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "No token"
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(
            token,
            SECRET_KEY
        );

        req.user = decoded;

        next();

    } catch(err){
        return res.status(401).json({
            message: "Invalid token"
        });
    }

}

app.get("/rooms",async (req, res) => {
  try{
    const rooms = await Room.find();

    res.json(rooms);
   
  } catch(error){

    console.error(error);

    res.status(500).json({
      message: "Load Failed"
    });

  }

});

app.post("/rooms" , verifyToken,async (req, res) =>{

  try{

    const newRoom = new Room({
      ...req.body,
      userId: req.user.userId
    });
    await newRoom.save();

    console.log("ได้รับข้อมูล",newRoom);

    res.json({
        message: "Room Added",
        room: newRoom
    });

  } catch(error){
    
    console.error(error);

    res.status(500).json({
      message: "Save Failed"
    });
  }


});

app.delete("/rooms/:id" , verifyToken, async (req,res) => {

  try{
    const room = await Room.findByIdAndDelete(req.params.id);

    if(!room){
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if(room.userId.toString() !== req.user.userId){
      return res.status(403).json({
        message : "You are not the owner"
      })
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      message : "Delete Success",
      statusD : statusD
    });

  }catch(error){
    console.error(error);

    res.status(500).json({
      message : "Delete Failed"
    });

  }

});

app.put("/rooms/:id" , verifyToken, async (req, res) =>{

  try{

    if(room.userId.toString() !== req.user.userId){
      return res.status(403).json({
        message : "You are not the owner"
      })
    }
    const id = req.params.id;

    const updateRoom = req.body;

    await Room.findByIdAndUpdate(
      id,
      updateRoom
    );

    res.json({
      message : "Update Success"
    });

  }catch(error){
    console.error(error);

    res.status(500).json({
      message : "Update Failed"
    });

  }
  
});

app.post("/register" , async (req, res) => {
  try{

    const {username , email , password } = req.body;

    const hashedPassword = 
      await bcrypt.hash(password,10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
      message : "Register Success"
    });
  }catch(error){
    console.error(error);

    res.status(500).json({
      message : "Register Failed"
    });

  }

});

app.post("/login" , async(req,res) => {

  const {email , password } = req.body;

  const user = await User.findOne({
    email : email
  });

  if(!user){
    return res.json({
      massage : "User Not Found"
    });
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if(!isMatch){
    return res.json({
      message : "Wrong Password"
    })
  }

  const token = jwt.sign(
    {
      userId : user._id,
      email: user.email
    },
    SECRET_KEY,
    {
      expiresIn : "1d"
    }
  );

  res.json({
    message : " Login Success ",
    token : token,
    userId : user._id
  });

})


app.get("/myrooms" , verifyToken , async (req, res) =>{
  try{
    const rooms = await Room.find({
      userId: req.user.userId
    });
  }catch(error){
    res.status(500).json({
      message: "Load Failed"
    })
  }

});


app.listen(5000, () => {
  console.log("Server Running");
});




