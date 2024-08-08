const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
  products: {
    //will store user.cart object
    type: Object
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    //ref specifies that it will be storing object
    //id(i.e the document_id) of User model
    //and User model will be used in population
    //population will replace this user_id with its document(with that user id) 
    //that exists in in User collection
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'processing' 
  },
  total : {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    // split() splits a string into an array of substrings(whenever 'T' is encountered), and returns the array
    //so choosing string at 0 index will be just date like 2024-08-06
    //originally it was 2024-08-06T18:27:48.263Z
    // toISOString() returns a date as string, using the ISO standard
    default: new Date().toISOString().split('T')[0]
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  }
}, {minimize: false});
//minmize:false signifies that we should even keep empty items(empty objects or
// arrays) and not remove them

//will create a collection of name Order that will contain 
//documents with schema as OrderSchema
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
