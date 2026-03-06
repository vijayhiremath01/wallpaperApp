const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
dotenv.config();

const port = process.env.PORT || 3000; 

connectDB();
connectRedis().catch((err) => {
    console.error('Redis connection failed', err);
});

app.listen(port , '0.0.0.0' , () => {
    console.log(`Server is running on port ${port}`)
})
