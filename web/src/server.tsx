import regeneratorRuntime from "regenerator-runtime";
const express = require("express");
const path = require("path");
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import Html from "./js/components/Html/Html";
import App from "./js/components/App/App";
import store from "./js/redux/store/store";
import { Provider } from "react-redux";
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet as StyledServerStyleSheets } from 'styled-components';
const fs = require('fs');


const app = express();

app.use("/public",express.static(path.join('dist','public')));

app.get("*", async (req, res, next) => {
  try{
    let location = req.location;
    const materialsheets = new ServerStyleSheets();
    const styledSheets = new StyledServerStyleSheets()
    const appHtml = ReactDOMServer.renderToString(
      styledSheets.collectStyles(
        materialsheets.collect(   
        <Provider store={store}>
          <StaticRouter location={location} context={{}}>
            <App />
          </StaticRouter>
        </Provider>
        )
      )
    );
    const sheetsString = [materialsheets.toString(), styledSheets.toString()]
    
    // const appMarkup = ReactDOMServer.renderToString(
    //   <Provider store={store}>
    //     <StaticRouter location={location} context={{}}>
    //       <App />
    //     </StaticRouter>
    //   </Provider>
    // );
    // const re = /^app\.main\..*\.js$/
    // let jsScriptName = null
    // fs.readdirSync(path.join('dist','public','js')).forEach((file:string)=>{
    //   if (re.test(file)){
    //     jsScriptName = file
    //   }
    // })
    // if (!jsScriptName){ 
    //   console.log("Can't find js file in "+path.join('dist','public','js') + " with regexp: "+/^app\.main\..*\.js$/) 
    //   throw new Error()
    // }
    const html = ReactDOMServer.renderToStaticMarkup(
      <Html injection={appHtml} styleSheets={sheetsString} jsfile={"app.main.js"} />
    );
    res.send(`<!doctype html>${html}`);
  }catch(error) {
    console.log(error),
    next(error)
  }

});

app.listen(3000, () => console.log(`Listening on localhost:3000`));
