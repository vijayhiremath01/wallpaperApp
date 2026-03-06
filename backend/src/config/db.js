const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Databse connected ! ");
    } catch (error) {
        console.log("Database connection failed ! ", error);
    }
}

module.exports = connectDB;