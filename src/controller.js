const Model = require('./model')
const logger = require("../logger");



class Controller {
// Uploading ----------------------------------------------------------------------
// static async uploadGif(req, res){
//     try {
//         res.send(`Gif ${req.file.filename} uploaded`);
//     } catch (error) {
//         logger.info(error);
//         res.send("Unable to upload the gif.")
//     }
// }
// static async uploadVideo(req, res){
//     try {
//         res.send(`Video ${req.file.filename} uploaded`);
//     } catch (error) {
//         logger.info(error);
//         res.send("Unable to upload the video.")
//     }
// }
static async uploadImage(req, res){
    try {
        res.send(`Image ${req.file.filename} uploaded`);
    } catch (error) {
        logger.info(error);
        res.send("Unable to upload the image.")
    }
}
// Uploading ----------------------------------------------------------------------


// Saving -------------------------------------------------------------------------
// static async saveGif(req, res){
//     try {
//         const data = req.body;
//         await Model.saveGif(data);
//         res.send(`Gif ${data.name} saved`)
//     } catch (error) {
//         logger.info(error)
//         res.send("Unable to save the gif.")
//     }
// }
// static async saveVideo(req, res){
//     try {
//         const data = req.body;
//         await Model.saveVideo(data);
//         res.send(`Video ${data.name} saved`)
//     } catch (error) {
//         logger.info(error)
//         res.send("Unable to save the video.")
//     }
// }
static async saveImage(req, res){
    try {
        const data = req.body;
        await Model.saveImage(data);
        res.send(`Image ${data.name} saved`)
    } catch (error) {
        logger.info(error)
        res.send("Unable to save the image.")
    }
}
static async postData(data){
    try {
        await Model.postData(data);
    } catch (error) {
        logger.info(error);
    }
}
// Saving -------------------------------------------------------------------------


// Get requests -------------------------------------------------------------------
static async getImageList(req, res){
    try {
        const result = await Model.getImageList();
        res.send(result);
    } catch (error) {
        logger.info(error)
        res.send("Unable to get the image list.")
    }
}
static async getMessageList(){
    try {
        return await Model.getMessageList();        
    } catch (error) {
        logger.info(error);
    }
}
// Get requests -------------------------------------------------------------------
static async changeImage(req,res){
    try {
        const data = req.body;
        await Model.changeImage(data);
        res.send(`Image ${data.name} changed`);
    } catch (error) {
        logger.info(error);
        res.send("Unable to change the image");
    }
}

// Put request --------------------------------------------------------------------

// Put request --------------------------------------------------------------------


// Delete requests ----------------------------------------------------------------
static async deleteImage(req, res){
    try {
        const {id} = req.body;
        await Model.deleteImage(id);
        res.send(`Image ${id} deleted`)
    } catch (error) {
        logger.info(error);
        res.send("Unable to delete the image.")
    }
}
static async deleteMessages(){
    try {
        await Model.deleteMessages();
    } catch (error) {
        logger.info(error)
    }
}

// Delete requests ----------------------------------------------------------------


}

module.exports = Controller