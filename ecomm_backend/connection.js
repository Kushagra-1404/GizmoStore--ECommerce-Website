//establishing a connection with our mongodb database using mongoose
//mongoose helps our backend to interact with our mongodb database
//mongodb atlas : allows us to have a database
require('dotenv').config();

const mongoose = require('mongoose');


mongoose.connect(process.env.DB_URI, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})