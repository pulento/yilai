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
import Light from "../components/light";
import renderer from "react-test-renderer";
import axios from "axios";

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
  const myComp = renderer.create(
    <Light lightserver={lightserver} key={testlight.id} light={testlight} />
  );

  const tree = myComp.toJSON();
  //console.log(tree);
  console.log(RGB_to_HSV({ r: 2, g: 2, b: 2 }));
  // Power button click
  tree.children[1].children[0].props.onClick({
    preventDefault: () => false
  });

  // Up button click
  tree.children[1].children[1].props.onClick({
    preventDefault: () => false
  });

  // Down button click
  tree.children[1].children[2].props.onClick({
    preventDefault: () => false
  });

  // Double click on box
  tree.props.onDoubleClick({
    preventDefault: () => false
  });

  // Color button
  tree.children[0].children[1].children[0].props.onClick({
    preventDefault: () => false
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

  it("Down click", () => {
    expect(axios.get).toBeCalledWith(`/light/${testlight.id}/temperature/4000`);
  });

  it("Color click", () => {
    expect(myComp.getInstance().state.displayColorPicker).toBe(true);
  });
});
