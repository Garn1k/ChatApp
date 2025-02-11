require("dotenv").config();

const variables = {
    port : process.env.port,
    db_url : process.env.db_url,
    hostOfServerWithGifs : "http://localhost:5000/uploadGif",
    hostOfServerWithVideos : "http://localhost:5000/uploadVideo",
    hostOfServerWithImages : "http://localhost:5000/uploadImage"
}

module.exports = variables