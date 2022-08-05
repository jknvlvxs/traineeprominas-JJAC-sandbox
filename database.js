const mongoose = require("mongoose");
const mdbURL =
  "mongodb+srv://teste:teste@cluster0.dhj6fjh.mongodb.net/?retryWrites=true&w=majority";

exports.connect = () => {
  mongoose.connect(mdbURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB: trainee-prominas");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected from: trainee-prominas");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Database error on connection:", err);
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Database disconnected due the end of application");
      process.exit(0);
    });
  });
};
