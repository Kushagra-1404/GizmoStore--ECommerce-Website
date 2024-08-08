const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");

//creating an order

//when order is created//then using web sockets to send notification to the
//admin

router.post("/", async (req, res) => {
  const io = req.app.get('socketio');
  const { userId, cart, country, address } = req.body;
  try {
    const user = await User.findById(userId);
    //creating document of scheme Order
    const order = await Order.create({
      owner: user._id,
      products: cart,
      country,
      address,
    });
    order.count = cart.count; ///count of total products in cart
    order.total = cart.total; //total price of all the products in cart
    //saving the document
    await order.save();
    //resetting usercart to initial value
    user.cart = { total: 0, count: 0 };
    user.orders.push(order);
    const notification = {status: 'unread', message: `New order from ${user.name}`, time: new Date()};
    //emitting an event - 'new-order'
    io.sockets.emit('new-order', notification);
    //marking orders array as modified
    user.markModified('orders');
    await user.save();
    //sending back the user with the updated cart
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

// // getting all orders of all users //for admin
router.get("/", async (req, res) => {
  try {
    //populating here means //replacing the value in owner field in each order document
    //that currently store the document_id(object_id) of its corresponding user
    //with its corresponding users {email,password}
    const orders = await Order.find().populate("owner", ["email", "name"]);
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

// //shipping order //marking the order as shipped
//and sending notification to the user using web socket

router.patch('/:id/mark-shipped', async(req, res)=> {
  const io = req.app.get('socketio');
  const {ownerId} = req.body;//userId
  const {id} = req.params;//order id
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, {status: 'shipped'});
    //find and populate the owner field with its corresponding users document
    //taking email and name field from that user document
    const orders = await Order.find().populate('owner', ['email', 'name']);
    const notification = {status: 'unread', message: `Order ${id} shipped with success`, time: new Date()};
    //emitting an event - 'notification' //only sending it to the user with that ownerId
    io.sockets.emit("notification", notification, ownerId);
    //unshift to push to the front of array
    user.notifications.unshift(notification);
    await user.save();
    res.status(200).json(orders)
  } catch (e) {
    res.status(400).json(e.message);
  }
})
module.exports = router;

// Population is the process of automatically replacing the specified paths 
// in the document with document(s) from other collection(s). We may populate 
// a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query.
