import { combineReducers } from "redux";
import gridReducer from "./gridReducer";

export default combineReducers({
  grid: gridReducer,
});
