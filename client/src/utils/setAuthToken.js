import api from "./api";

// store JWT in LS and set axios headers if do have a token

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["a-auth-token"];
    localStorage.removeItem("token");
  }
};

export default setAuthToken;
