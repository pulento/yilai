// Light routes
const debug = require("debug")("yilai");

// Emitter to Promise for Async/Await
function getResponse(yeelight) {
  return new Promise(function(resolve, reject) {
    yeelight.once("response", (id, result) => {
      resolve(id);
    });
  });
}

module.exports = (app, yeelightSearch) => {
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
        let light = {
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

  app.get("/light/:light/:command/:param?", async (req, res) => {
    var yeelight = yeelightSearch.getYeelightById(req.params.light);

    if (yeelight) {
      if (req.params.command == "toggle") {
        try {
          const reqid = await yeelight.toggle();
          const respid = await getResponse(yeelight);
          res.json({ result: "ok", id: yeelight.id });
        } catch (err) {
          res.json({ result: "error", id: yeelight.id, msg: err.message });
        }
      } else if (req.params.command == "setname") {
        if (req.params.param) {
          try {
            const reqid = await yeelight.setName(req.params.param);
            const respid = await getResponse(yeelight);
            res.json({ result: "ok", id: yeelight.id });
          } catch (err) {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          }
        } else {
          res.json({
            result: "error",
            id: yeelight.id,
            msg: "must provide a name"
          });
        }
      } else if (req.params.command == "brightness") {
        if (req.params.param) {
          try {
            const reqid = await yeelight.setBrightness(req.params.param);
            const respid = await getResponse(yeelight);
            res.json({ result: "ok", id: yeelight.id });
          } catch (err) {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          }
        } else {
          res.json({
            result: "error",
            id: yeelight.id,
            msg: "must provide a value"
          });
        }
      } else if (req.params.command == "color") {
        if (req.params.param) {
          try {
            const reqid = await yeelight.setRGB(req.params.param);
            const respid = await getResponse(yeelight);
            res.json({ result: "ok", id: yeelight.id });
          } catch (err) {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          }
        } else {
          res.json({
            result: "error",
            id: yeelight.id,
            msg: "must provide a value"
          });
        }
      } else if (req.params.command == "temperature") {
        if (req.params.param) {
          try {
            const reqid = await yeelight.setColorTemperature(req.params.param);
            const respid = await getResponse(yeelight);
            res.json({ result: "ok", id: yeelight.id });
          } catch (err) {
            res.json({ result: "error", id: yeelight.id, msg: err.message });
          }
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
