import React, { Component } from "react";
//import ReactDOM from "react-dom";
import axios from "axios";
import { HuePicker } from "react-color";

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

// Color conversion routines
// from Please.io
// http://www.checkman.io/please/
//
// Accepts RGB object, returns HSV object
export function RGB_to_HSV(RGB) {
  var r = RGB.r / 255,
    g = RGB.g / 255,
    b = RGB.b / 255;
  var computed_H = 0,
    computed_S = 0,
    computed_V = 0;
  var min_RGB = Math.min(r, Math.min(g, b)),
    max_RGB = Math.max(r, Math.max(g, b));
  // Black-gray-white
  if (min_RGB === max_RGB) {
    computed_V = min_RGB;
    return {
      h: 0,
      s: 0,
      v: computed_V
    };
  }
  // Colors other than black-gray-white:
  var d = r === min_RGB ? g - b : b === min_RGB ? r - g : b - r;
  var h = r === min_RGB ? 3 : b === min_RGB ? 1 : 5;
  computed_H = 60 * (h - d / (max_RGB - min_RGB));
  computed_S = (max_RGB - min_RGB) / max_RGB;
  computed_V = max_RGB;
  return {
    h: computed_H,
    s: computed_S,
    v: computed_V
  };
}

// Accepts hex string, produces RGB object
export function HEX_to_RGB(hex) {
  var regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(regex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Accepts hex string, returns HSV object
export function HEX_to_HSV(hex) {
  return RGB_to_HSV(HEX_to_RGB(hex));
}

// Light Component

export default class Light extends Component {
  constructor(props) {
    super(props);

    this.baseurl = props.lightserver;
    this.state = {
      label: "",
      backcolor: "white",
      light: this.props.light,
      displayColorPicker: false
    };
  }

  componentWillMount() {
    if (this.props.light.name) {
      this.setState({ label: this.props.light.name });
    } else {
      this.setState({ label: this.props.light.id });
    }
    this.setBackColor();
  }

  onChange = event => {
    event.preventDefault();
    this.setState({ label: event.target.value });
  };

  onPowerClick = async event => {
    event.preventDefault();
    console.log(event);
    await axios.get(`${this.baseurl}/light/${this.props.light.id}/toggle`);
    await sleep(20);
    await this.getLightState();
    console.log("Light State: ");
    console.log(this.state.light);
    this.setBackColor();
  };

  onUpClick = async event => {
    event.preventDefault();
    var newbright = parseInt(this.state.light.bright, 10) + 10;
    if (newbright > 100) newbright = 100;
    await this.setBrightness(newbright);
  };

  onDownClick = async event => {
    event.preventDefault();
    var newbright = parseInt(this.state.light.bright, 10) - 10;
    if (newbright < 1) newbright = 1;
    await this.setBrightness(newbright);
  };

  onColorClick = event => {
    event.preventDefault();
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  onColorClose = event => {
    event.preventDefault();
    this.setState({ displayColorPicker: false });
  };

  onBoxDoubleClk = async event => {
    event.preventDefault();
    // Reset to white
    await axios.get(
      `${this.baseurl}/light/${this.props.light.id}/temperature/4000`
    );
    await sleep(20);
    await this.getLightState();
    this.setBackColor();
  };

  onColorChange = async color => {
    var mycolor = color.hex.replace("#", "");

    const res = await axios.get(
      `${this.baseurl}/light/${this.props.light.id}/color/${mycolor}`
    );
    console.log(res);
    await sleep(20);
    await this.getLightState();
    console.log("Light State: ");
    console.log(this.state.light);

    this.setBackColor();
  };

  onDoubleClick = event => {
    event.preventDefault();
    console.log(event);
  };

  onSubmit = async event => {
    event.preventDefault();
    console.log(this.state.label);

    // Set name
    await axios.get(
      `${this.baseurl}/light/${this.props.light.id}/setname/${this.state.label}`
    );
    await sleep(20);
    await this.getLightState();
    console.log("Light State: ");
    console.log(this.state.light);
    //this.setBackColor();

    // Remove focus
    this.nameInput.blur();
  };

  setBrightness(bright) {
    return new Promise((resolve, reject) => {
      if (bright >= 1 && bright <= 100) {
        axios
          .get(
            `${this.baseurl}/light/${this.props.light.id}/brightness/${bright}`
          )
          .then(() => {
            return sleep(20);
          })
          .then(() => {
            return this.getLightState();
          })
          .then(() => {
            console.log("Light State: ");
            console.log(this.state.light);
            this.setBackColor();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject(`Invalid brightness value: ${bright}`);
      }
    });
  }

  setBackColor() {
    if (this.state.light.power === "on") {
      if (parseInt(this.state.light.color_mode, 10) === 2) {
        this.setState({
          backcolor: `hsl(60,100%,${this.state.light.bright * 0.6 + 20}%)`
        });
      } else {
        // Color background
        let mycolor = parseInt(this.state.light.rgb, 10).toString(16);
        while (mycolor.length < 6) {
          mycolor = "0" + mycolor;
        }
        mycolor = "#" + mycolor;
        const hue = HEX_to_HSV(mycolor).h;

        this.setState({
          backcolor: `hsl(${hue},100%,${this.state.light.bright * 0.6 + 20}%)`
        });
      }
    } else {
      this.setState({ backcolor: "white" });
    }
  }

  getLightState() {
    return new Promise((resolve, reject) => {
      // Get state
      axios
        .get(`${this.baseurl}/light/${this.props.light.id}`)
        .then(res => {
          this.setState({ light: res.data });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  render() {
    const lightstyle = {
      backgroundColor: this.state.backcolor,
      float: "left"
    };

    let offline = null;
    if (this.state.light.status !== 3) {
      offline = (
        <button style={{ fontSize: "20px" }} disabled>
          <i className="fa fa-exclamation-circle" aria-hidden="true" />
        </button>
      );
    }

    const popover = {
      position: "absolute",
      margin: "36px 0px 0px 0px",
      zIndex: "2"
    };
    const cover = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px"
    };

    return (
      <div
        className="lightbox"
        style={lightstyle}
        onDoubleClick={this.onBoxDoubleClk}
      >
        <div className="upper-lightbox" style={{ height: "32px" }}>
          <form className="light-input-name" onSubmit={this.onSubmit}>
            <input
              ref={input => {
                this.nameInput = input;
              }}
              className="light-input-name"
              style={lightstyle}
              value={this.state.label}
              onChange={this.onChange}
              onDoubleClick={this.onDoubleClick}
            />
          </form>
          {this.state.light.model === "color" ? (
            <div className="color-picker">
              <button
                className="color-picker-btn"
                onClick={this.onColorClick}
              />
              {this.state.displayColorPicker ? (
                <div style={popover}>
                  <div style={cover} onClick={this.onColorClose} />
                  <HuePicker
                    color={this.state.backcolor}
                    onChangeComplete={this.onColorChange}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="lower-lightbox">
          <button style={{ fontSize: "20px" }} onClick={this.onPowerClick}>
            <i className="fa fa-power-off" />
          </button>
          <button style={{ fontSize: "20px" }} onClick={this.onUpClick}>
            <i className="fa fa-arrow-up" aria-hidden="true" />
          </button>
          <button style={{ fontSize: "20px" }} onClick={this.onDownClick}>
            <i className="fa fa-arrow-down" aria-hidden="true" />
          </button>
          {offline}
        </div>
      </div>
    );
  }
}
