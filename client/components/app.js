import React, { Component } from "react";
import LightsArray from "./lights_array";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lights: [],
      lightserver: this.props.lightserver
    };

    const config = {
      method: "get",
      url: `${this.state.lightserver}/light`,
      headers: {
        //'Access-Control-Allow-Origin': '*',
      }
    };

    axios.request(config).then(res => {
      this.setState({ lights: res.data });
    });
  }

  render() {
    return (
      <div>
        <div>Lights: {this.state.lights.length}</div>
        <LightsArray
          lightserver={this.state.lightserver}
          lights={this.state.lights}
        />
      </div>
    );
  }
}
