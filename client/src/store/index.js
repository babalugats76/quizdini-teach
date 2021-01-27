import { createStore } from "vuex";
import test from "./modules/test";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    test,
  },
  strict: debug,
});
export default store;
