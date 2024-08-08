const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//schema is used to define the structure of data that we
//we will store in our database
const UserSchema = mongoose.Schema({

    name: {
      type: String,
      required: [true, 'is required']
    },
  
    email: {
      type: String,
      required: [true, 'is required'],
      unique: true,
      index: true,//because we need to find users by index
      validate: {
        validator: function(str){
          ///returning a regular expression
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
        },
        message: props => `${props.value} is not a valid email`
      }
    },
  
    password: {
      type: String,
      required: [true, 'is required']
    },
  
    isAdmin: {
      type: Boolean,
      default: false
    },
  
    cart: {
      type: Object,
      //will also be storing (if any product in cart)
      //product_id:count of that product
      default: {
        total: 0,//to store total price of products in cart
        count: 0//count of products in cart
      }
    },
  //will store notifications which will we received using web socket when 
  //admin marks any of its order as shipped
    notifications: {
      type: Array,
      default: []
    },
  
    //ref specifies that it will be storing array of object
    //id (i.e the document_id) of ordres this user of Order model
     //and Order model will be used in population
    //population will replace all these order_id with its document(with that order id) 
    //that exists in Order collection
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}]
  
  }, {minimize: false});

  UserSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(!user) throw new Error('invalid credentials');
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if(isSamePassword) return user;
    throw new Error('invalid credentials');
  }

  //when we are sending 'user' back to frontend...we need to remove something from 
  //user like the password
  UserSchema.methods.toJSON = function(){
    const user = this;
    //converting to object
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }
  //before saving => hash the password
  UserSchema.pre('save', function (next) {

    const user = this;
  
    if(!user.isModified('password')) return next();
    //function will be called when promise is returned
    bcrypt.genSalt(10, function(err, salt){
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
  
        user.password = hash;
        next();
      })
  
    })
  
  })
  
  UserSchema.pre('remove', function(next){
    this.model('Order').remove({owner: this._id}, next);
  })

  const User = mongoose.model('User', UserSchema);

  module.exports = User;
