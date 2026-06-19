const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description : String,
    roomtype : String,
    image : String,

    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

module.exports = mongoose.model("Room", RoomSchema);