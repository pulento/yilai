import React, { Component } from "react";
import Light from "./light";

const LightsArray = props => {
  console.log(props.lights);
  const lightsItem = props.lights.map(light => {
    return (
      <Light lightserver={props.lightserver} key={light.id} light={light} />
    );
  });

  return <div>{lightsItem}</div>;
};

export default LightsArray;
