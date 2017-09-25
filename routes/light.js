// Light routes

module.exports = app => {
  // List lights or light props
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

  // Manages lights commands

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
};