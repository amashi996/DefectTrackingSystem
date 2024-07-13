import api from "./api";
//import axios from "axios";

// store JWT in LS and set axios headers if do have a token

/*const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["a-auth-token"];
    localStorage.removeItem("token");
  }
};*/

// Store JWT in localStorage and set axios headers if there is a token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
  }
};

export default setAuthToken;
