import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

import App from "./components/app";

//const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  //<Provider store={createStoreWithMiddleware(reducers)}>
  <App lightserver="http://localhost:8000" />,
  //</Provider>
  document.querySelector(".container")
);
