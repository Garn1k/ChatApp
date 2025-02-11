const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {type : String}
})

const MessageSchema = new mongoose.Schema({
    messages : [{
        name : {type : String},
        message : {type : String},
        dateTime : {type : String, default : Date.now.toString()}
    }]
})

const MessageModel = mongoose.model("Message", MessageSchema)
const ModelImage = mongoose.model("Image", Schema)
const ModelVideo = mongoose.model("Video", Schema)
const ModelGif = mongoose.model("Gif", Schema)


module.exports = {ModelImage, ModelVideo, ModelGif, MessageModel};