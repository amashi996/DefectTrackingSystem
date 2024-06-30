import { combineReducers } from "redux";

import alert from "./alert";
import auth from "./alert";
import profile from "./profile";
import review from "./review";

export default combineReducers({
  alert,
  auth,
  profile,
  review,
});
