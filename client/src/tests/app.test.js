// Mocking Axios to simulate just one light returned
jest.mock("axios", () => ({
  request: jest.fn(req => {
    console.log(req);
    return Promise.resolve({
      data: [
        {
          id: "0x20000000044c1e72",
          name: "Kids",
          model: "color",
          power: "off",
          bright: "100",
          rgb: "16711680",
          color_mode: "2",
          hue: "359",
          sat: "100",
          ct: "4000",
          flowing: "0",
          delayoff: "0",
          flow_params: "",
          music_on: "0",
          status: 3,
          lastupdate: 1411732258133
        }
      ]
    });
  })
}));

import React from "react";
import ReactDOM from "react-dom";
import App from "../components/app";
import axios from "axios";

describe("app.js", () => {
  it("Renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });

  it("Light API called once", () => {
    expect(axios.request.mock.calls.length).toBe(1);
  });

  it("Light API called with parameters", () => {
    expect(axios.request).toBeCalledWith({
      headers: {},
      url: "undefined/light",
      method: "get"
    });
  });
});
