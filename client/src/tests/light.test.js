// Mocking Axios to simulate just one light returned
jest.mock("axios", () => ({
  get: jest.fn(req => {
    console.log(req);
    return Promise.resolve({
      data: { result: "ok" }
    });
  })
}));

import React from "react";
import ReactDOM from "react-dom";
import Light from "../components/light";
import renderer from "react-test-renderer";
import axios from "axios";
import { RGB_to_HSV } from "../components/light";
import { HEX_to_RGB } from "../components/light";

var testlight = {
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
};

describe("light.js", () => {
  const lightserver = "";

  const div = document.createElement("div");
  const myComp = ReactDOM.render(
    <Light lightserver={lightserver} key={testlight.id} light={testlight} />,
    div
  );

  // Submit light name
  myComp.onSubmit({
    preventDefault: () => false
  });

  // Power button click
  myComp.onPowerClick({
    preventDefault: () => false
  });

  // Up button click
  myComp.onUpClick({
    preventDefault: () => false
  });

  // Down button click
  myComp.onDownClick({
    preventDefault: () => false
  });

  // Double click on box
  myComp.onBoxDoubleClk({
    preventDefault: () => false
  });

  // Color button
  myComp.onColorClick({
    preventDefault: () => false
  });

  // Color change to blue
  myComp.onColorChange({
    hex: "005dff"
  });

  it("Set name", () => {
    expect(axios.get).toBeCalledWith(
      `/light/${testlight.id}/setname/${testlight.name}`
    );
  });

  it("Toggle click", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/toggle`);
  });

  it("Up click", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/brightness/100`);
  });

  it("Down click", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/brightness/90`);
  });

  it("Double click", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/temperature/4000`);
  });

  it("Color click", () => {
    expect(myComp.state.displayColorPicker).toBe(true);
  });

  it("Color change", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/color/005dff`);
  });

  // Conversion functions
  it("RGB to HSV", () => {
    expect(RGB_to_HSV({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, v: 1 });
  });

  it("HEX to RGB", () => {
    expect(HEX_to_RGB("#00fffe")).toEqual({ r: 0, g: 255, b: 254 });
  });
});
