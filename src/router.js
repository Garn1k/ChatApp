// External modules -------------------------------------------------------------
const express = require("express");
const router = express.Router();
const multer = require("multer");
// External modules -------------------------------------------------------------


// Internal modules -------------------------------------------------------------
const Controller = require("./controller");
const uploadImage = require("../middlewares/image.upload.middleware");
// const uploadVideo = require("../middlewares/video.upload.middlware");
// const uploadGif = require("../middlewares/gif.upload.middleware");
// Internal modules -------------------------------------------------------------


// Uploading --------------------------------------------------------------------
// router.post("/uploadGif", uploadGif.single("user_gif"), Controller.uploadGif);  //dont use this
// router.post("/uploadvideo", uploadVideo.single("user_video"), Controller.uploadVideo);  //dont use this
router.post("/uploadImage", uploadImage.single("user_img"), Controller.uploadImage);
// Uploading --------------------------------------------------------------------


// Express requests -------------------------------------------------------------
// router.post("/saveGif", Controller.saveGif);  //dont use this
// router.post("/saveVideo", Controller.saveVideo); //dont use this
router.post("/saveUser", Controller.saveImage);
router.get("/getImageList", Controller.getImageList);
router.delete("/deleteImage", Controller.deleteImage);
router.put("/changeImage", Controller.changeImage);
// Express requests -------------------------------------------------------------




module.exports = router;
