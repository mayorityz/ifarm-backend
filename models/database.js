const db = require("mongoose");
const connection = db.connect(
  "mongodb+srv://mayorityz:majormayor@ifarms-app-wpmr0.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

module.exports = connection;
//"mongodb+srv://mayorityz:majormayor@ifarms-app-wpmr0.mongodb.net/test?retryWrites=true&w=majority"
// "mongodb://127.0.0.1:27017/ifarmApp"
// mongodb://127.0.0.1:27017
