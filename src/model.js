// External modules -------------------------------------------------------------
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
// External modules -------------------------------------------------------------

// Internal modules -------------------------------------------------------------
const {ModelImage, ModelVideo, ModelGif, MessageModel} = require("../mongo/mongo.model")
const {connectMongo, disconnectMongo} = require('../mongo/mongo.connect');
const logger = require("../logger")
const {hostOfServerWithGifs, hostOfServerWithVideos, hostOfServerWithImages} = require('./variables.config')
// Internal modules -------------------------------------------------------------


class Model{
static fileDir = path.join(__dirname, "../uploads/images");
// Post requests ----------------------------------------------------------------
// static async saveGif(data){
//     try {
//        await connectMongo();
//         let fullName = hostOfServerWithGifs + "/" + Object.values(data)[0];
//         await ModelGif.create({[Object.keys(data)[0]] : fullName});
//         logger.info("Gif saved")
//     } catch (error) {
//         logger.info(error)
//     } finally{
//        await disconnectMongo()
//     }
// }
// static async saveVideo(data){
//     try {
//        await connectMongo();
//         let fullName = hostOfServerWithVideos + "/" + Object.values(data)[0];
//         await ModelVideo.create({[Object.keys(data)[0]] : fullName});
//         logger.info("Video saved")
//     } catch (error) {
//         logger.info(error)
//     } finally{
//        await disconnectMongo()
//     }
// }
static async saveImage(data){
    try {
        await connectMongo();
        let fullName = hostOfServerWithImages + "/" + Object.values(data)[0];
        await ModelImage.create({[Object.keys(data)[0]] : fullName});
        logger.info("Image saved")
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
static async postData(data){
    try {
        await connectMongo();
        await MessageModel.findOneAndUpdate({},{$push : {messages : data}}, {upsert : true});
        logger.info("Data saved")
    } catch (error) {
        logger.info(error)
    } finally {
        await disconnectMongo()
    }
}
// Post requests ----------------------------------------------------------------


// Get requests -----------------------------------------------------------------
static async getImageList(){
    try {
       await connectMongo();
       return await ModelImage.find({}); 
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
static async getMessageList(){
    try {
        await connectMongo();
        const messageList =  await MessageModel.find({});
        const list = Object.values(messageList[0])[2].messages;
        return list;
        
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
// Get requests -----------------------------------------------------------------


// Put requests -----------------------------------------------------------------
static async changeImage(data){
    try {
        await connectMongo();
        const {id} = data;
        let fullName = hostOfServerWithImages + "/" + Object.values(data)[1];
        const {name} = await ModelImage.findById(id);
        await ModelImage.findByIdAndUpdate(id,{[Object.keys(data)[1]] : fullName});
        const changedName = name.split("/")[4];
        fs.unlinkSync(Model.fileDir + "/" + changedName);
        logger.info("Image changed")
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
// Put requests -----------------------------------------------------------------


// Delete requests --------------------------------------------------------------
static async deleteImage(id){
    try {
        await connectMongo()
        const result = await ModelImage.findByIdAndDelete(id);
        const temp = result.name;
        const name = temp.split("/")[4];
        fs.unlinkSync(Model.fileDir + "/" + name);
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
static async deleteMessages(){
    try {
        await connectMongo()
        await MessageModel.deleteMany({});
    } catch (error) {
        logger.info(error)
    } finally{
        await disconnectMongo()
    }
}
// Delete requests --------------------------------------------------------------

}



module.exports = Model
