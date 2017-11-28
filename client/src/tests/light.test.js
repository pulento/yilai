// Mocking Axios to simulate just one light returned
jest.mock("axios", () => ({
  get: jest.fn(req => {
    console.log(req);
    return Promise.resolve({
      data: {
        id: "0x20000000044c1e72",
        name: "Kids",
        model: "color",
        power: "on",
        bright: "100",
        rgb: "16711680",
        color_mode: "1",
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
  model: "color",
  power: "on",
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

  it("Up click", async () => {
    // Up button click
    await myComp.onUpClick({
      preventDefault: () => false
    });
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/brightness/100`);
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  it("Set name", async () => {
    // Submit light name
    await myComp.onSubmit({
      preventDefault: () => false
    });
    expect(axios.get).toBeCalledWith(
      `/light/${testlight.id}/setname/${testlight.id}`
    );
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  it("Down click", async () => {
    myComp.setState({ light: { bright: "100" } });
    // Down button click
    await myComp.onDownClick({
      preventDefault: () => false
    });
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/brightness/90`);
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  it("Toggle click", async () => {
    // Power button click
    await myComp.onPowerClick({
      preventDefault: () => false
    });
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/toggle`);
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  it("Double click", async () => {
    // Double click on box
    await myComp.onBoxDoubleClk({
      preventDefault: () => false
    });
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/temperature/4000`);
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  it("Color click", () => {
    // Color button
    myComp.onColorClick({
      preventDefault: () => false
    });
    expect(myComp.state.displayColorPicker).toBe(true);
  });

  it("Label change", () => {
    // Color button
    myComp.onChange({
      preventDefault: () => false,
      target: { value: "Cool" }
    });
    expect(myComp.state.label).toBe("Cool");
  });

  it("Color close", () => {
    // Color button
    myComp.onColorClose({
      preventDefault: () => false
    });
    expect(myComp.state.displayColorPicker).toBe(false);
  });

  it("Color change", async () => {
    // Color change to blue
    await myComp.onColorChange({
      hex: "005dff"
    });
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/color/005dff`);
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}`);
  });

  // Conversion functions
  it("RGB to HSV", () => {
    expect(RGB_to_HSV({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, v: 1 });
  });

  it("HEX to RGB", () => {
    expect(HEX_to_RGB("#00fffe")).toEqual({ r: 0, g: 255, b: 254 });
  });

  it("Black HSV", () => {
    expect(RGB_to_HSV({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 });
  });

});
