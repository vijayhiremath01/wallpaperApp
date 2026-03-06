const imagekit = require('imagekit');
const dotenv = require('dotenv');

dotenv.config();

const imageKit = new imagekit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

module.exports = imageKit;
