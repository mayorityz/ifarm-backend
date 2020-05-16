const DB = require("mongoose");

const orderSchema = new DB.Schema({
  customerId: String,
  orderId: String,
  customerDetails: Object,
  order: Array,
  orderDate: Date,
  paymentStatus: { type: String, default: "InComplete" },
  orderStatus: { type: String, default: "InComplete" },
});

const Order = DB.model("Orders", orderSchema);

class CustomerOrders {
  /**
   * Save New Order
   * @param {string} customerId - customer id
   * @param {string} orderId - Order id
   * @param {object} customerDetails - Detailed Desc. of the Customer
   * @param {object} order - cart item
   */
  static async save(customerId, orderId, customerDetails, order) {
    const options = {
      customerId: customerId,
      orderId: orderId,
      customerDetails: customerDetails,
      order: order,
    };
    try {
      let O = new Order(options);
      return await O.save((response, err) => {
        if (err) return `Order Error ${err}`;
        else return "Order Saved";
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CustomerOrders;
