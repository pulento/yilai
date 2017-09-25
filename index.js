console.log("Yeelight FrontEnd Server starting!");

// Modules
const express = require("express");
const debug = require("debug")("yilai");
const path = require("path");
const yilaiConf = require(path.join(__dirname, "config"));

// Yeelight
const YeelightSearch = require("yeelight-wifi");
const yeelightSearch = new YeelightSearch();

var app = express();

if (yilaiConf.global.cors) {
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

// Routes
require("./routes/light")(app, yeelightSearch);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

yeelightSearch.on("found", lightBulb => {
  var yeeid = lightBulb.getId();
  var yeemodel = lightBulb.getModel();
  var yeename = lightBulb.getName();

  debug("Found Yeelight ID: %s Model: %s Name: %s", yeeid, yeemodel, yeename);
  lightBulb
    .getValues(
      "power",
      "bright",
      "rgb",
      "color_mode",
      "hue",
      "sat",
      "ct",
      "flowing",
      "delayoff",
      "flow_params",
      "music_on"
    )
    .then(reqid => {
      lightBulb.once("response", (id, result) => {
        if (reqid === id) {
          lightBulb["power"] = result[0];
          lightBulb["bright"] = result[1];
          lightBulb["rgb"] = result[2];
          lightBulb["color_mode"] = result[3];
          lightBulb["hue"] = result[4];
          lightBulb["sat"] = result[5];
          lightBulb["ct"] = result[6];
          lightBulb["flowing"] = result[7];
          lightBulb["delayoff"] = result[8];
          lightBulb["flow_params"] = result[9];
          lightBulb["music_on"] = result[10];

          debug(
            `power ${result[0]} and brightness ${result[1]} for request ${id}`
          );
        }
      });
    });

  lightBulb.on("notifcation", json => {
    //debug(`Async notification: %o`, json);
    if (json.method == "props" && json.params) {
      for (var property in json.params) {
        if (json.params.hasOwnProperty(property)) {
          debug(
            `Light ${lightBulb.id} ${property} is ${json.params[property]}`
          );
          lightBulb[property] = json.params[property];
        }
      }
    }
  });
});

function lightsTimer() {
  debug("Periodic Lights search");
  yeelightSearch.refresh();
}

function refreshTimer() {
  debug("Refresh Lights data");
  yeelightSearch.getYeelights().forEach(function(light) {
    light.getValues(
      "power",
      "bright",
      "rgb",
      "color_mode",
      "hue",
      "sat",
      "ct",
      "flowing",
      "delayoff",
      "flow_params",
      "music_on"
    );
  });
}

setInterval(lightsTimer, yilaiConf.yee.periodic_search * 1000);

process.on("uncaughtException", function(err) {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Yeelight Server listening at http://[%s]:%d", host, port);
});
