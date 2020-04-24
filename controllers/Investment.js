const InvestmentModel = require("../models/Investment");
const getReference = require("uuid");
const paystack = require("paystack")(
  "sk_test_f22375735008edb501116fe73a2e5db6f4aaa68d"
);

exports.newInvestment = async (req, res, next) => {
  const { investmentAmt, duration, monthly, total, userID } = req.body;
  const ref = `iFarms-${getReference.v1()}`;
  const investmentBegins = new Date();
  const days = duration * 30;
  const investmentEnds = investmentBegins.setDate(
    investmentBegins.getDate() + days
  );

  paystack.transaction
    .initialize({
      amount: investmentAmt * 100,
      reference: ref,
      name: "mayowa",
      email: "mayority11@gmail.com",
      callback_url: "https://ifarms-herokuapp.com/verify",
    })
    .then((result) => {
      const { status, data } = result;
      if (status) {
        const inv = new InvestmentModel({
          investmentAmt,
          duration,
          monthlyReturn: monthly,
          expectedTotal: total + parseFloat(investmentAmt),
          startedDate: investmentBegins,
          dueDate: investmentEnds,
          investorId: userID,
          reference: ref,
        });
        try {
          let stuff = inv.create();
          if (stuff) res.send(data.authorization_url);
        } catch (error) {
          console.log(error);
          res.status(500).send("Error!");
        }
      } else {
        res.send("Invalid Trans Id");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.verification = async (req, res, next) => {
  const reference = req.query.reference;
  if (!reference) res.send("invalid Payment Reference.");
  paystack.transaction
    .verify(reference)
    .then((result) => {
      const { status, message } = result;
      if (!status) res.send("Invalid Reference Provided!!!");
      // update the db
      try {
        let update = InvestmentModel.update({ reference }, { payment: true })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
        console.log(update);
        if (update)
          res.redirect("https://ifarms-app.surge.sh/dashboard/newinvestment");
      } catch (error) {
        res.send("Database Connection Error!");
      }
    })
    .catch((err) => {
      res.send("An Error Has Occured!!!");
    });
};

exports.investments = async (req, res, next) => {
  const userID = req.params.userid;
  try {
    InvestmentModel.findAll({ investorId: userID })
      .then((res_) => res.send(res_))
      .catch((err) => console.log(err));
  } catch (error) {
    res.send("Error : " + error);
  }
};
