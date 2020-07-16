import { createContext, useContext } from "react";

export const AuthContext = createContext({
  // The presence of an access token signifies that the user is logged in.
  token: "",
  username: "",
  isStudent: false,
  isTeacher: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useLoggedIn() {
  const auth = useContext(AuthContext);
  return auth.token;
}
