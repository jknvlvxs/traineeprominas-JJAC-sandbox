const mongoose = require('mongoose');
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/trainee-prominas?retryWrites=true';

exports.connect = () => {

mongoose.connect(mdbURL, {useCreateIndex: true, useNewUrlParser: true, useFindAndModify:false});

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB: trainee-prominas');
    });
  
    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected from: trainee-prominas');
    });
  
    mongoose.connection.on('error', err => {
      console.log('Database error on connection:', err);
    });
  
    process.on('SIGINT', () => {
  
      mongoose.connection.close(() => {
        console.log('Database disconnected due the end of application');
        process.exit(0);
      });
  
    });
  };