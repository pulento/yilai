import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { ChromePicker } from "react-color";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const pausetime = 80;

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

  onPowerClick = event => {
    event.preventDefault();
    console.log(event);
    axios
      .get(`${this.baseurl}/light/${this.props.light.id}/toggle`)
      .then(res => {
        sleep(pausetime).then(() => {
          this.getLightState().then(() => {
            console.log("Light State: ");
            console.log(this.state.light);
            this.setBackColor();
          });
        });
      });
  };

  onUpClick = event => {
    event.preventDefault();
    let newbright = this.state.light.bright + 10;
    if (newbright >= 100) newbright = 100;
    this.setBrightness(newbright);
  };

  onDownClick = event => {
    event.preventDefault();
    let newbright = this.state.light.bright - 10;
    if (newbright <= 1) newbright = 1;
    this.setBrightness(newbright);
  };

  onColorClick = event => {
    event.preventDefault();
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  onColorClose = event => {
    event.preventDefault();
    this.setState({ displayColorPicker: false });
  };

  onColorChange = color => {
    var mycolor = color.hex.replace("#", "");
    axios
      .get(`${this.baseurl}/light/${this.props.light.id}/color/${mycolor}`)
      .then(res => {
        console.log(res);
        sleep(pausetime).then(() => {
          this.getLightState().then(() => {
            console.log("Light State: ");
            console.log(this.state.light);
            mycolor = "#" + this.state.light.rgb.toString(16);
            console.log(mycolor);
            //this.setBackColor();
            this.setState({ backcolor: mycolor });
          });
        });
      });
  };

  onDoubleClick = event => {
    event.preventDefault();
    console.log(event);
  };

  onSubmit = event => {
    event.preventDefault();
    console.log(this.state.label);

    // Set name
    axios
      .get(
        `${this.baseurl}/light/${this.props.light.id}/setname/${this.state
          .label}`
      )
      .then(res => {
        sleep(pausetime).then(() => {
          this.getLightState().then(() => {
            console.log("Light State: ");
            console.log(this.state.light);
            //this.setBackColor();
          });
        });
      });
    // Remove focus
    this.nameInput.blur();
  };

  setBrightness(bright) {
    if (bright >= 1 && bright <= 100) {
      axios
        .get(
          `${this.baseurl}/light/${this.props.light.id}/brightness/${bright}`
        )
        .then(res => {
          sleep(pausetime).then(() => {
            this.getLightState().then(() => {
              console.log("Light State: ");
              console.log(this.state.light);
              this.setBackColor();
            });
          });
        });
    }
  }

  setBackColor() {
    if (this.state.light.power === "on") {
      this.setState({
        backcolor: `hsl(60,100%,${this.state.light.bright * 0.6 + 20}%)`
      });
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
    if (this.state.light.status != 3) {
      offline = (
        <button style={{ fontSize: "20px" }} disabled>
          <i className="fa fa-exclamation-circle" aria-hidden="true" />
        </button>
      );
    } else {
      offline = null;
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
      <div className="lightbox" style={lightstyle}>
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
          <div className="color-picker">
            <button className="color-picker-btn" onClick={this.onColorClick} />
            {this.state.displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={this.onColorClose} />
                <ChromePicker
                  color={this.state.backcolor}
                  onChangeComplete={this.onColorChange}
                />
              </div>
            ) : null}
          </div>
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
