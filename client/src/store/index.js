import { createStore, createLogger } from "vuex";
import test from "./modules/test";
import auth from "./modules/auth";
import countries from "./modules/countries";
import { apiHelperPlugin } from "./apiHelper";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  plugins: [...(debug ? [createLogger()] : []), apiHelperPlugin],
  modules: {
    test,
    auth,
    countries,
  },
  strict: debug,
});
export default store;
