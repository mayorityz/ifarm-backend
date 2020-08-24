const UserModel = require("../models/User");
const Mailer = require("../util/nodemail");
const Hash = require("../util/hashing");
const jwt = require("jsonwebtoken");

exports.newUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, pass1: password } = req.body;
    const hash = Hash.encrypt_(password);
    const newAccount = new UserModel({
      firstName,
      lastName,
      email,
      password: hash,
    });
    const save = await newAccount.save();
    if (!save) throw "An Error Occured While Saving This Account!";
    else {
      const newRegMsg = `Hi ${fn},
            <p>You have successfully created an account on i-farms.com</p>
            <p>Thank you for joining us!</p>
            <p>Click the link below to verify & activate your account </p>
            <a href="http://i-farms.com/verify-my-account?email=${email}&uuid=${hash}">Verify Account</a>
            <p>Thank you for joining.</p>`;
      await Mailer.registration(
        email,
        "iFarms : Account Verification",
        newRegMsg
      );
      res.status(201).json({ success: true, errors: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      errors: [{ msg: `Error : ${error}` }],
    });
  }
};

exports.userLogin = async (req, res_, next) => {
  const { password, email } = req.body;
  UserModel.findOne({ email: email }, (err, res) => {
    if (err) {
      console.log(err);
      res_.json({ success: false, msg: err.message });
      return;
    }

    if (res !== null) {
      if (res.status === false)
        return res_.json({
          success: false,
          msg: "Account exists, but not verified!",
        });
      // sigin
      if (Hash.checkPassWord(password, res.password)) {
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

exports.verifyUser = async (req, res) => {
  const { email, uuid } = req.body;
  try {
    let update_ = await UserModel.findOneAndUpdate(
      { email, password: uuid, status: false },
      { status: true }
    );
    if (update_ === null) throw "Invalid Verification Process!";
    else res.send("ok!");
  } catch (error) {
    res.send(`${error}`);
  }
};
