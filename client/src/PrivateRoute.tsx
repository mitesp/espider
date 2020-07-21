import { navigate } from "@reach/router";
import React, { useEffect } from "react";

import { useLoggedIn } from "./context/auth";

//@ts-ignore TODO: fix
function PrivateRoute({ as: Component, ...props }) {
  const loggedIn = useLoggedIn();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login", { state: { referer: props.location } });
    }
  }, [loggedIn, props.location]);
  return <Component {...props} />;
}

export default PrivateRoute;
