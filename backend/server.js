const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
dotenv.config();

const port = process.env.PORT ; 

connectDB();

app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})