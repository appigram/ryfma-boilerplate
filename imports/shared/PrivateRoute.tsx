import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "/imports/hooks"

function PrivateRoute({ component: Component, ...rest }) {
  const { token } = useAuth()

  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute
