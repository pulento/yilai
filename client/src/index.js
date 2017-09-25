import React from "react";
import ReactDOM from "react-dom";
//import { Provider } from "react-redux";
//import { createStore, applyMiddleware } from "redux";

import App from "./components/app";

//const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  //<Provider store={createStoreWithMiddleware(reducers)}>
  // You can point FE to another API server else leave it blank
  <App lightserver="" />,
  //</Provider>
  document.querySelector(".container")
);
