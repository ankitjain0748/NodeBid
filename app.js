const dotenv = require("dotenv");
require("./utils/mongoconfig");
dotenv.config();
const express = require('express');
const apiroute = require('./Routes/ContactUs');
const userroute = require("./Routes/User")
const pannaroute = require("./Routes/Panna")
const widthrwal = require("./Routes/Widthrawl")
const marketing = require("./Routes/Market")
const app = express();


const cors = require("cors");
const corsOptions = {
  origin: '*',// Update this with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API data response' });
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// API Routes
app.use('/api', apiroute);
app.use('/user', userroute);
app.use("/panna", pannaroute)
app.use("/payment", widthrwal)
app.use("/market", marketing)



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
