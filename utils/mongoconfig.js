const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log("process.env.DB_URL}", process.env.DB_URL)

mongoose.connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
    maxPoolSize: 10,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: false,
    socketTimeoutMS: 45000,
    family: 4
}).then((res) => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB CONNECTION ERROR =>>: ', err);
});