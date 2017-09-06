console.log("Yeelight FrontEnd Server starting!");

// Modules
const express = require("express");
const debug = require("debug")("yilai");
const path = require("path");
const yeeConf = require(path.join(__dirname, "config"));

// Yeelight
const YeelightSearch = require("yeelight-wifi");
const yeelightSearch = new YeelightSearch();

var app = express();

if (yeeConf.global.cors) {
  // Allow CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Origin, Accept, Content-Length, X-Requested-With, Access-Control-Allow-Origin"
    );

    // Intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

app.use(express.static("public"));
app.get("/", (req, res) => {
  yeelightSearch.refresh();
  res.send({ result: "ok" });
});

const PORT = process.env.PORT || 8000;
