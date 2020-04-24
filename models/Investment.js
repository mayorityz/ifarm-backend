const DB = require("mongoose");

const investmentSchema = new DB.Schema({
  investorId: String,
  investmentAmt: Number,
  rates: Number,
  monthlyReturn: Number,
  expectedTotal: Number,
  startdate: Date,
  duration: Number,
  dueDate: Date,
  history: Array,
  reference: String,
  payment: { type: Boolean, default: false },
  created: { type: Date, default: new Date() },
  isConcluded: { type: Boolean, default: false },
});

const Investment = DB.model("investments", investmentSchema);

class Investments {
  constructor(query) {
    console.log("saving invest record");
    this.dbModel = new Investment(query);
  }

  create() {
    return this.dbModel.save();
  }
  static update(query, update) {
    return Investment.updateOne(query, update);
  }

  static findAll(query) {
    return Investment.find(query);
  }
}

module.exports = Investments;
