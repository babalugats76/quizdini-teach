import { createStore, createLogger } from "vuex";
import account from "./modules/account";
import auth from "./modules/auth";
import countries from "./modules/countries";
import matches from "./modules/matches";
import payments from "./modules/payments";
import states from "./modules/states";
import actions from "./actions";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  plugins: [...(debug ? [createLogger()] : []) /*, apiHelperPlugin */],
  actions: actions,
  modules: {
    account,
    auth,
    countries,
    matches,
    payments,
    states,
  },
  strict: debug,
});
export default store;
