const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require("./connection");
const { Server } = require("socket.io");
//web sockets allow us to send messages back and forth
//in our case to send notifications to the user
//creating new instance of socket.io by passing the server(HTTP server)
const io = new Server(server, {
//so that any only accept requests from our frontend with below methods
  // cors: 'http://localhost:3001',
  cors: 'https://gizmostore.netlify.app',
  methods: ['GET', 'POST', 'PATCH', "DELETE"]
});

const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require('./routes/orderRoutes');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/images", imageRoutes);
app.use('/orders', orderRoutes);

app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    // console.log(paymentIntent);
    res.status(200).json(paymentIntent);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

server.listen(8080, () => {
  console.log("server running at port", 8080);
});

//by this we can have this available in our routes
//setting io as our socketio 
app.set('socketio', io);
