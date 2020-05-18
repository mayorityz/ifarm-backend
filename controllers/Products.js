const Product = require("../models/Products");
const UserModel = require("../models/User");
const OrderModel = require("../models/Orders");
const Paystack = require("../util/paystack");
const uuid = require("uuid");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "ifarms-app",
  api_key: "241998374551364",
  api_secret: "gZMJ6VDEmZ14EBOHPb-jKZgk5gA",
});

const userDetails = async (id) => {
  try {
    return await UserModel.findById(id, (err, res) => {
      return err ? "" : res;
    });
  } catch (err) {
    return err;
  }
};

exports.allProducts = (req, res, next) => {
  const p = Product.displayAll();
  p.then((res_) => {
    res.json(res_);
  }).catch((err) => {
    res.status(500).json({ err });
  });
};

exports.newProducts = async (req, res, next) => {
  const { body, files } = req;
  const { title, category, price, measurement, quantity, desc, userid } = body;
  let userInfo = await userDetails(userid);
  const { firstName, lastName, email, phone1, address, profileImg } = userInfo;
  const imgType = ["image/jpeg", "image/jpg", "image/png"];
  let errorMsg = [];
  let imgArray = [];
  files.map((file) => {
    if (imgType.indexOf(file.mimetype) === -1) {
      errorMsg.push("error found");
    }
  });
  if (errorMsg.length > 0) {
    res.send("Invalid File Added!!!");
  } else {
    for (let i = 0; i < files.length; i++) {
      cloudinary.uploader.upload(files[i]["path"], function (result, err) {
        if (err) {
          console.log(err);
          return;
        }
        const { secure_url: url } = result;
        callBack(url, files.length);
      });
    }
  }

  let callBack = (url, length) => {
    imgArray.push(url);
    if (imgArray.length === length) {
      const product = new Product({
        title,
        category,
        price,
        measurement,
        quantity,
        description: desc,
        imgUrls: imgArray,
        vendorId: userid,
        vendorDetails: {
          firstName,
          lastName,
          email,
          phone1,
          address,
          profileImg,
        },
      });
      product.newProduct();
      res.send("Your Product Has Been Added To The Marketplace!!!");
    }
  };
};

exports.myProducts = (req, res, next) => {
  const userId = req.params.userid;

  try {
    Product.userProducts({ vendorId: userId })
      .then((res_) => {
        res.json(res_);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.send(error);
  }
};

exports.productDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Product.productDetails({ _id: id }).then((result) => {
      console.log(result);
      res.json({ status: "success", result });
    });
  } catch (error) {}
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    await Product.delete(id).then((result) => {
      res.json({ status: "success", result });
    });
  } catch (error) {}
};

exports.checkout = async (req, res) => {
  const { userId, cart, price } = req.body;

  const userInfo = await userDetails(userId);
  const { email, firstName, lastName, phone1, address } = userInfo;
  const orderId = uuid.v1();
  try {
    const initPayment = new Paystack();
    initPayment
      .makePayment(
        "https://ifarms-app.surge.sh/products/verifypayment",
        price,
        orderId,
        firstName,
        email
      )
      .then(async (ress) => {
        await OrderModel.save(
          userId,
          orderId,
          { email, firstName, lastName, phone1, address },
          cart,
          price
        );
        res.send(ress);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.verify = async (req, res) => {
  const reference = req.query.reference;
  if (!reference) res.send("Invalid Payment Reference.");
  try {
    Paystack.verifyPayment(reference).then((res_) => {
      // update the db...
      if (res_ === "Verification successful")
        res.redirect(
          "https://ifarms-app.surge.sh/dashboard/shopping-cart?status=completed"
        );
      else
        res.redirect(
          "https://ifarms-app.surge.sh/dashboard/shopping-cart?status=error"
        );
    });
  } catch (error) {}
};

exports.update = async (req, res) => {
  const {
    id,
    title,
    price,
    category,
    measurement,
    description,
    quantity,
  } = req.body;
  let update_ = await Product.edit(
    id,
    title,
    category,
    price,
    measurement,
    quantity,
    description
  );

  if (update_ !== "error") {
    res.status(200).send("success");
  } else {
    res.status(500).send("An Error Occured");
  }
};
