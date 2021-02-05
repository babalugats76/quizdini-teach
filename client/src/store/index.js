import { createStore, createLogger } from "vuex";
import test from "./modules/test";
import auth from "./modules/auth";
import countries from "./modules/countries";
// import { apiHelperPlugin } from "./apiHelper";
import actions from "./actions";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  plugins: [...(debug ? [createLogger()] : []) /*, apiHelperPlugin */],
  actions: actions,
  modules: {
    test,
    auth,
    countries,
  },
  strict: debug,
});
export default store;
