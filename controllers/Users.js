const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const encrypt = (password) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

const checkPassWord = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const checkUserExists = async (email) => {
  try {
    return await UserModel.findOne({ email: email }, (err, res) => {
      return err ? "" : res;
    });
  } catch (err) {
    return err;
  }
};

exports.newUser = async (req, res, next) => {
  // create the new user account here ...
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, pass1: password } = req.body;
    const hash = encrypt(password);
    const newAccount = new UserModel({
      firstName,
      lastName,
      email,
      password: hash,
    });

    (await checkUserExists(email)) !== null
      ? res.json({
          success: false,
          errors: [{ msg: `${email} already exists...` }],
        })
      : // save new user
        newAccount.save((err, result) => {
          if (err) {
            return res.json({
              success: false,
              errors: [{ msg: "An Error Has Occured" }],
            });
          }
          if (result) res.json({ success: true, errors: false });
        });
  } catch (error) {
    console.log(error);
  }
};

exports.userLogin = async (req, res_, next) => {
  const { password, email } = req.body;
  UserModel.findOne({ email: email }, (err, res) => {
    if (err) {
      console.log(err);
      res_.json({ success: false, msg: err.name });
      return;
    }

    if (res !== null) {
      // sigin
      if (checkPassWord(password, res.password)) {
        console.log(res._id);
        let token = jwt.sign({ id: res._id, email: email }, "iFarmSecretKey", {
          expiresIn: "24h",
        });
        res_.json({ success: true, msg: token });
      } else {
        console.log("Invalid Password");
        res_.json({ success: false, msg: "Invalid Password ..." });
      }
    } else {
      console.log("invalid credentials");
      res_.json({ success: false, msg: "Invalid Credentials ..." });
    }
  });
};

exports.userProfile = async (req, res, next) => {
  const { userid } = req.params;
  UserModel.findOne({ _id: userid }, (err, res_) => {
    if (err) res.status(401).send("Database Error");
    res.json(res_);
  });
};

exports.userUpdate = async (req, res, next) => {
  const { firstName, lastName, phone1, phone2, address, LGA, state } = req.body;
  const { userid } = req.params;
  UserModel.updateOne(
    { _id: userid },
    { firstName, lastName, phone1, phone2, address, LGA, State: state },
    (err, res_) => {
      if (err) console.log(err);
      if (res_) res.json("Updated Successfully");
    }
  );
};

exports.allUsers = async (req, res, next) => {
  const query = UserModel.find({});
  const promise = query.exec();
  promise
    .then((res_) => {
      res.status(200).json(res_);
    })
    .catch((err) => {
      res.status(500).send("Error!");
    });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  UserModel.findByIdAndDelete(id)
    .then((response) => {
      console.log(response);
      res.send("Record Deleted");
    })
    .catch((err) => {
      res.send("An Error Has Occured! ", err);
    });
};
