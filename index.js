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

// Routes

app.get("/light/:light?", function(req, res) {
  var lights = [];

  if (!req.params.light) {
    debug("Lights requested");
    yeelightSearch.getYeelights().forEach(function(value) {
      debug(value.id);
      lights.push({
        id: value.id,
        name: value.name,
        model: value.model,
        power: value.power,
        bright: value.bright,
        rgb: value.rgb,
        color_mode: value.color_mode,
        hue: value.hue,
        sat: value.sat,
        ct: value.ct,
        flowing: value.flowing,
        delayoff: value.delayoff,
        flow_params: value.flow_params,
        music_on: value.music_on,
        status: value.status,
        lastupdate: value.lastKnown
      });
    });
    res.json(lights);
  } else {
    debug(`Light ID ${req.params.light} requested`);
    var yeelight = yeelightSearch.getYeelightById(req.params.light);

    if (yeelight) {
      light = {
        id: yeelight.id,
        name: yeelight.name,
        model: yeelight.model,
        power: yeelight.power,
        bright: yeelight.bright,
        rgb: yeelight.rgb,
        color_mode: yeelight.color_mode,
        hue: yeelight.hue,
        sat: yeelight.sat,
        ct: yeelight.ct,
        flowing: yeelight.flowing,
        delayoff: yeelight.delayoff,
        flow_params: yeelight.flow_params,
        music_on: yeelight.music_on,
        status: yeelight.status,
        lastupdate: yeelight.lastKnown
      };

      res.json(light);
      //debug(yeelight);
    } else {
      res.json({ result: "not found" });
    }
  }
});

app.get("/light/:light/:command/:param?", function(req, res) {
  var yeelight = yeelightSearch.getYeelightById(req.params.light);

  if (yeelight) {
    light = {
      id: yeelight.id,
      name: yeelight.name,
      ct: yeelight.ct,
      status: yeelight.status
    };

    if (req.params.command == "toggle") {
      yeelight.toggle().then(reqid => {
        yeelight
          .once("response", (id, result) => {
            res.json({ result: "ok", id: yeelight.id });
          })
          .catch(err => {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          });
      });
    } else if (req.params.command == "setname") {
      if (req.params.param) {
        yeelight
          .setName(req.params.param)
          .then(reqid => {
            yeelight.once("response", (id, result) => {
              res.json({ result: "ok", id: yeelight.id });
            });
          })
          .catch(err => {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          });
      } else {
        res.json({
          result: "error",
          id: yeelight.id,
          msg: "must provide a name"
        });
      }
    } else if (req.params.command == "brightness") {
      if (req.params.param) {
        yeelight
          .setBrightness(req.params.param)
          .then(reqid => {
            yeelight.once("response", (id, result) => {
              res.json({ result: "ok", id: yeelight.id });
            });
          })
          .catch(err => {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          });
      } else {
        res.json({
          result: "error",
          id: yeelight.id,
          msg: "must provide a value"
        });
      }
    } else if (req.params.command == "color") {
      if (req.params.param) {
        yeelight
          .setRGB(req.params.param)
          .then(reqid => {
            yeelight.once("response", (id, result) => {
              res.json({ result: "ok", id: yeelight.id });
            });
          })
          .catch(err => {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          });
      } else {
        res.json({
          result: "error",
          id: yeelight.id,
          msg: "must provide a value"
        });
      }
    } else if (req.params.command == "temperature") {
      if (req.params.param) {
        yeelight
          .setColorTemperature(req.params.param)
          .then(reqid => {
            yeelight.once("response", (id, result) => {
              res.json({ result: "ok", id: yeelight.id });
            });
          })
          .catch(err => {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          });
      } else {
        res.json({
          result: "error",
          id: yeelight.id,
          msg: "must provide a value"
        });
      }
    } else {
      res.json({ command: "Not found", id: yeelight.id });
    }
  } else {
    res.json({ result: "Not found" });
  }
});

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

setInterval(lightsTimer, yeeConf.yee.periodic_search * 1000);

process.on("uncaughtException", function(err) {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Yeelight Server listening at http://[%s]:%d", host, port)
});
