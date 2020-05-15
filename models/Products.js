const DB = require("mongoose");

const productsSchema = new DB.Schema({
  title: String,
  price: Number,
  vendorId: String,
  vendorDetails: Array,
  imgUrls: Array,
  measurement: String,
  category: String,
  description: String,
  quantity: Number,
  reviews: Array,
  uploaded: { type: Date, default: Date.now() },
});

const Product = DB.model("products", productsSchema);

class Products {
  constructor(query) {
    this.p = new Product(query);
    this.allProducts;
  }
  newProduct() {
    this.p.save((err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }

  static displayAll() {
    const query = Product.find({});
    const promise = query.exec();
    return promise
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  static userProducts(query) {
    return Product.find(query);
  }

  static productDetails(query) {
    return Product.find(query);
  }

  static delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = Products;
