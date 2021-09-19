import React from "react"
import ReactDOM from "react-dom"
import App from "./js/components/App/App"
import { BrowserRouter as Router} from "react-router-dom"
import { Provider } from "react-redux"
import store from "./js/redux/store/store"


import "regenerator-runtime/runtime"

require('mapbox-gl/dist/mapbox-gl.css')

require("./scss/main/main.scss");

ReactDOM.hydrate(
  <Provider store={store}>
    <Router>
        <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
