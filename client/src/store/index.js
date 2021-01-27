import { createStore } from "vuex";
import test from "./modules/test";
import countries from "./modules/countries";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    test,
    countries,
  },
  strict: debug,
});
export default store;
