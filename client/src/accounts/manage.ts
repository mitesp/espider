import { loginEndpoint, studentSignupEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";

/**
 * Attempts to log in with given username and password. If successful, sets
 * tokens in local storage.
 * Returns success boolean along with access token if successful, else error
 * message.
 */
async function login(
  username: string,
  password: string
): Promise<{ success: boolean; info: string }> {
  return await axiosInstance
    .post(loginEndpoint, { username, password })
    .then(result => {
      if (result.status === 200) {
        axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.access;
        localStorage.setItem("token", result.data.access);
        localStorage.setItem("refresh", result.data.refresh);
        return { success: true, info: result.data.access };
      } else {
        return { success: false, info: `return bad status ${result.status}` };
      }
    })
    .catch(e => {
      return { success: false, info: e };
    });
}

async function signupStudent(
  username: string,
  password: string,
  phoneNumber: string,
  school: string
): Promise<{ success: boolean; info: string }> {
  return await axiosInstance
    .post(studentSignupEndpoint, {
      username,
      password,
      profile: {
        phone_number: phoneNumber,
        school: school,
      },
    })
    .then(result => {
      if (result.status === 201) {
        axiosInstance.defaults.headers["Authorization"] = "JWT " + result.data.tokens.access;
        localStorage.setItem("token", result.data.tokens.access);
        localStorage.setItem("refresh", result.data.tokens.refresh);
        return { success: true, info: result.data.tokens.access };
      } else {
        return { success: false, info: `return bad status ${result.status}` };
      }
    })
    .catch(e => {
      return { success: false, info: e };
    });
}

/**
 * Logs user out by deleting local tokens.
 * TODO: keep track of logging out on the server?
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  delete axiosInstance.defaults.headers.common["Authorization"];
}

export { login, logout, signupStudent };
