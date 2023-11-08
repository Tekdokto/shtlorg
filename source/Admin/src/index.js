/*!
=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
changesv1
*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';

import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";

import authHeader from "helpers/auth-header.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import 'react-toastify/dist/ReactToastify.css';

const hist = createBrowserHistory();
console.log("che",authHeader())
ReactDOM.render(
  <Provider store={configureStore()}>
  <Router history={hist}>
    <Switch>
    <Route path="/auth" component={AuthLayout} />
    <Route path="/admin"  component={AdminLayout} />
      <Redirect from="/" to="/auth/login" />
    </Switch>
  </Router>
  </Provider>,
  document.getElementById("root")
  
);
