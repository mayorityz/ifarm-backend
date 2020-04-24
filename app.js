const express = require("express");
const cors = require("cors");
const app = express();
const DataBase = require("./models/database");
const path = require("path");
const Port = process.env.PORT || 8080;
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Products");
const investmentRoutes = require("./routes/Investment");

app.use(cors());
app.get("/", express.static(path.join(__dirname, "./images")));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(productRoutes);
app.use(investmentRoutes);
// catch undefined routes and respond with 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// catch server errors and respond with 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// server
DataBase.then(() => {
  console.log("db is connected");
  app.listen(Port, () => {
    console.log(`running on port:${Port}`);
  });
}).catch((err) => {
  console.log(err);
});
