const express = require("express");

const Router = express.Router();

const controller = require("../controllers/Investment");

Router.post("/newinvestment", controller.newInvestment);
Router.get("/verify", controller.verification);
Router.get("/myinvestments/:userid", controller.investments);
Router.get("/investment/:id", controller.fetchOne);
Router.get("/fetchallinvestment", controller.fetchAll);

module.exports = Router;
