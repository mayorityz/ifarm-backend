const OrderModel = require("../models/Orders");
exports.orders = async (req, res) => {
  const orderList = await OrderModel.fetchall();
  if (orderList === "error") res.status(500).send("Database Error!");
  else res.status(200).json(orderList);
};
