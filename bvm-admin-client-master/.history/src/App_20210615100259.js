import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Loader } from "./globalutilities";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { store } from "./Services/store";
import "./App.scss";
import "ladda/dist/ladda-themeless.min.css";
import "antd/dist/antd.css";
import "react-select/dist/react-select.min.css";
import "react-toastify/dist/ReactToastify.css";
import { checkAuth } from "./Services/actions/auth";
import TeamManegment from "./views/TeamManegment/TeamManegment";

const loading = () => <Loader />;

const SignIn = Loadable({
  loader: () => import("./views/Login"),
  loading,
});

const resetPassword = Loadable({
  loader: () => import("./views/ResetPassword"),
  loading,
});

const DefaultLayout = Loadable({
  loader: () => import("./containers/DefaultLayout"),
  loading,
});

const PrivateRoute = ({ component: Component }) => (
  <Route
    render={(props) =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
const RedirectRoute = ({ component: Component }) => (
  <Route
    render={(props) =>
      localStorage.getItem("token") ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

class App extends Component {
  async componentWillMount() {
    await checkAuth();
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/teammanegment"
              name="Team Manegment"
              component={TeamManegment}
            />

            <Route
              exact
              path="/resetpassword"
              name="resetpassword"
              component={resetPassword}
            />
            <RedirectRoute
              exact
              path="/login"
              name="SignIn Page"
              component={SignIn}
            />
            <PrivateRoute path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
