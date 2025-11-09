const { mongoose } = require('mongoose');
required('dotenv').config()

const connectDB = async () => { 
    try {
        const conn = await mongooge.conection(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Sucessfully Connected: ${conn.connection.host}`);
    } catch (error) { 
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;