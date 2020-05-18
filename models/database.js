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
